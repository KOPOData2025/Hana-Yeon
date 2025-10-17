package com.hanati.hanadundun_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanati.hanadundun_backend.dto.pension.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PensionService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${kosis.api.key}")
    private String kosisApiKey;

    // 상수 정의
    private static final String KOSIS_BASE_URL = "https://kosis.kr/openapi/Param/statisticsParameterData.do";
    private static final String NATIONAL_PENSION = "국민연금";
    private static final String RETIREMENT_PENSION = "퇴직연금";
    private static final String PERSONAL_PENSION = "개인연금";
    private static final String BASIC_PENSION = "기초ㆍ장애인연금";
    private static final String OCCUPATIONAL_PENSION = "직역연금";



    /**
     * 통계청 api 호출하고 응답 JSON을 지정된 DTO 타입으로 파싱
     * @param url 호출할 API URL
     * @param typeRef 파싱할 DTO TypeReference
     * @return 파싱된 DTO
     * @param <T> 파싱할 DTO 타입
     */
    private <T> Mono<T> callKosisApi(String url, TypeReference<T> typeRef) {
        log.debug("KOSIS API 호출 URL: {}", url.replaceAll("apiKey=[^&]*", "apiKey=***"));
        return webClient.get()
                .uri(url)
                .header("Accept", "application/json")
                .retrieve()
                .onStatus(
                        status -> !status.is2xxSuccessful(),
                        response -> {
                            log.error("KOSIS API 호출 실패 - HTTP Status: {}", response.statusCode());
                            return Mono.error(new RuntimeException("KOSIS API 호출 실패: " + response.statusCode()));
                        }
                )
                .bodyToMono(String.class)
                .map(responseBody -> {
                    try {
                        if (responseBody.contains("\"err\":")) {
                            log.error("KOSIS API 에러 응답: {}", responseBody);
                            throw new RuntimeException("KOSIS API 에러: " + responseBody);
                        }
                        return objectMapper.readValue(responseBody, typeRef);
                    } catch (IOException e) {
                        log.error("KOSIS API 응답 파싱 실패", e);
                        throw new RuntimeException("KOSIS API 응답 파싱 실패", e);
                    }
                })
                .doOnSuccess(data -> log.debug("KOSIS API 호출 성공"))
                .doOnError(error -> log.error("KOSIS API 호출 실패", error));
    }




    public Mono<PeerContributionResponseDto> getPeerContributionAverage(int age) {
        String ageGroup = getAgeGroup(age); // 10세 단위 그룹
        List<String> irpAgeGroups = getIrpAgeGroups(age); // 5세 단위 그룹

        // 1. 월평균 연금보험료 데이터 조회 및 가공
        Mono<Map<String, Object>> contributionMono = callKosisApi(buildContributionApiUrl(), new TypeReference<List<KosisPeerAverageResponseDto>>() {})
                .map(kosisData -> {
                    if (kosisData.isEmpty()) throw new NoSuchElementException("KOSIS Contribution API로부터 유효한 데이터를 받지 못했습니다.");
                    String latestYear = kosisData.stream()
                            .map(KosisPeerAverageResponseDto::getPRD_DE)
                            .max(String::compareTo)
                            .orElseThrow(() -> new NoSuchElementException("최신 연도 데이터를 찾을 수 없습니다."));
                    Map<String, Long> contributionMap = kosisData.stream()
                            .filter(data -> latestYear.equals(data.getPRD_DE()) && ageGroup.equals(data.getC2_NM()))
                            .collect(Collectors.toMap(
                                    KosisPeerAverageResponseDto::getC3_NM,
                                    data -> (long) (Double.parseDouble(data.getDT()) * 1000),
                                    (existing, replacement) -> existing
                            ));
                    Map<String, Object> result = new HashMap<>();
                    result.put("data", contributionMap);
                    result.put("year", latestYear);
                    return result;
                });

        // 2. IRP 적립금액 데이터 조회 및 가공
        Mono<Map<String, Long>> irpMono = callKosisApi(buildIrpApiUrl(), new TypeReference<List<Map<String, Object>>>() {})
                .map(list -> {
                    if (list.isEmpty()) throw new NoSuchElementException("KOSIS IRP API로부터 데이터를 받지 못했습니다.");
                    String latestYear = list.stream()
                            .map(d -> (String) d.get("PRD_DE")).filter(Objects::nonNull)
                            .max(String::compareTo)
                            .orElseThrow(() -> new NoSuchElementException("최신 연도 데이터를 찾을 수 없습니다."));
                    List<Map<String, Object>> latestData = list.stream()
                            .filter(d -> latestYear.equals(d.get("PRD_DE")))
                            .toList();
                    Map<String, Long> result = new HashMap<>();
                    for (String gender : Arrays.asList("계", "남자", "여자")) {
                        long totalAmount = 0L;
                        long totalCount = 0L;
                        for (String ageGrp : irpAgeGroups) {
                            totalAmount += latestData.stream()
                                    .filter(d -> gender.equals(d.get("C1_NM")) && ageGrp.equals(d.get("C2_NM")) && "적립금액".equals(d.get("ITM_NM")))
                                    .mapToLong(d -> Long.parseLong(d.get("DT").toString()) * 1_000_000L).findFirst().orElse(0L);
                            totalCount += latestData.stream()
                                    .filter(d -> gender.equals(d.get("C1_NM")) && ageGrp.equals(d.get("C2_NM")) && "가입자 수".equals(d.get("ITM_NM")))
                                    .mapToLong(d -> Long.parseLong(d.get("DT").toString())).findFirst().orElse(0L);
                        }
                        result.put(gender, (totalCount > 0) ? totalAmount / totalCount : 0L);
                    }
                    return result;
                });

        // 3. 두 데이터 Mono를 조합하여 최종 DTO 생성
        return Mono.zip(contributionMono, irpMono)
                .map(tuple -> {
                    Map<String, Object> contributionResult = tuple.getT1();
                    @SuppressWarnings("unchecked")
                    Map<String, Long> contributionMap = (Map<String, Long>) contributionResult.get("data");
                    String dataYear = (String) contributionResult.get("year");
                    Map<String, Long> irpMap = tuple.getT2();
                    long nationalPension = contributionMap.getOrDefault(NATIONAL_PENSION, 0L);
                    long occupationalPension = contributionMap.getOrDefault(OCCUPATIONAL_PENSION, 0L);
                    long personalPension = contributionMap.getOrDefault(PERSONAL_PENSION, 0L);

                    return PeerContributionResponseDto.builder()
                            .userAge(age)
                            .peerAgeGroup(ageGroup)
                            .averageTotalContribution(nationalPension + occupationalPension + personalPension)
                            .nationalPension(nationalPension)
                            .occupationalPension(occupationalPension)
                            .personalPension(personalPension)
                            .totalAccumulatedRetirementPensionAmount(irpMap.getOrDefault("계", 0L))
                            .maleAccumulatedRetirementPension(irpMap.getOrDefault("남자", 0L))
                            .femaleAccumulatedRetirementPension(irpMap.getOrDefault("여자", 0L))
                            .dataYear(dataYear)
                            .build();
                });
    }

    public PensionBenchmarkResponseDto getPeerAveragePension(int age) {
        String targetAgeGroup = convertAgeToAgeGroup(age);
        List<KosisExpectedReceiveAmountResponseDto> kosisData = callKosisApi(buildPredictApiUrl(), new TypeReference<List<KosisExpectedReceiveAmountResponseDto>>() {}).block();

        if (kosisData == null || kosisData.isEmpty()) {
            throw new RuntimeException("KOSIS API에서 데이터를 조회할 수 없습니다.");
        }

        String latestYear = kosisData.stream()
                .map(KosisExpectedReceiveAmountResponseDto::getBaseYear).filter(Objects::nonNull)
                .max(String::compareTo)
                .orElseThrow(() -> new RuntimeException("유효한 기준 연도 데이터가 없습니다."));

        Map<String, Long> pensionAmountMap = kosisData.stream()
                .filter(data -> latestYear.equals(data.getBaseYear()) && targetAgeGroup.equals(data.getAgeGroup()) && "월평균 수급금액".equals(data.getItemName()))
                .filter(data -> data.getPensionType() != null && data.getDataValue() != null && !"-".equals(data.getDataValue().trim()))
                .collect(Collectors.toMap(
                        KosisExpectedReceiveAmountResponseDto::getPensionType,
                        data -> convertToWon(data.getDataValue()),
                        (existing, replacement) -> existing
                ));

        Long nationalPension = pensionAmountMap.getOrDefault(NATIONAL_PENSION, 0L);
        Long retirementPension = pensionAmountMap.getOrDefault(RETIREMENT_PENSION, 0L);
        Long personalPension = pensionAmountMap.getOrDefault(PERSONAL_PENSION, 0L);
        Long basicPension = pensionAmountMap.getOrDefault(BASIC_PENSION, 0L);

        return PensionBenchmarkResponseDto.builder()
                .targetAgeGroup(targetAgeGroup)
                .averageTotalPension(nationalPension + retirementPension + personalPension + basicPension)
                .nationalPension(nationalPension)
                .retirementPension(retirementPension)
                .personalPension(personalPension)
                .dataYear(latestYear)
                .build();
    }


    private Long convertToWon(String dataValue) {
        if (dataValue == null || dataValue.trim().isEmpty() || "-".equals(dataValue.trim())) return 0L;
        try {
            String cleanValue = dataValue.replaceAll(",", "").trim();
            return Math.round(Double.parseDouble(cleanValue) * 1000);
        } catch (NumberFormatException e) {
            log.warn("데이터 값 변환 실패: {}", dataValue, e);
            return 0L;
        }
    }

    private String getAgeGroup(int age) {
        if (age >= 18 && age <= 29) return "18~29세";
        if (age >= 30 && age <= 39) return "30~39세";
        if (age >= 40 && age <= 49) return "40~49세";
        if (age >= 50 && age <= 59) return "50~59세";
        if (age >= 60) return "60세 이상";
        throw new IllegalArgumentException("지원하지 않는 연령 그룹입니다: " + age);
    }

    private List<String> getIrpAgeGroups(int age) {
        String specificAgeGroup;
        if (age <= 24)      specificAgeGroup = "20 - 24세"; 
        else if (age <= 29) specificAgeGroup = "25 - 29세";
        else if (age <= 34) specificAgeGroup = "30 - 34세";
        else if (age <= 39) specificAgeGroup = "35 - 39세";
        else if (age <= 44) specificAgeGroup = "40 - 44세";
        else if (age <= 49) specificAgeGroup = "45 - 49세";
        else if (age <= 54) specificAgeGroup = "50 - 54세";
        else if (age <= 59) specificAgeGroup = "55 - 59세";
        else if (age <= 64) specificAgeGroup = "60 - 64세";
        else                specificAgeGroup = "65세 이상";
        return Collections.singletonList(specificAgeGroup);
    }

    private String convertAgeToAgeGroup(int age) {
        if (age >= 20 && age <= 24) return "20~24세";
        if (age >= 25 && age <= 29) return "25~29세";
        if (age >= 30 && age <= 34) return "30~34세";
        if (age >= 35 && age <= 39) return "35~39세";
        if (age >= 40 && age <= 44) return "40~44세";
        if (age >= 45 && age <= 49) return "45~49세";
        if (age >= 50 && age <= 54) return "50~54세";
        if (age >= 55 && age <= 59) return "55~59세";
        if (age >= 60 && age <= 64) return "60~64세";
        if (age >= 65 && age <= 69) return "65~69세";
        if (age >= 70 && age <= 74) return "70~74세";
        if (age >= 75 && age <= 79) return "75~79세";
        if (age >= 80) return "80세 이상";
        throw new IllegalArgumentException("지원하지 않는 연령대입니다: " + age + "세");
    }


    // 필요한 값만 가져오기 위해
    private String buildPredictApiUrl() {
        return KOSIS_BASE_URL + "?method=getList&apiKey=" + kosisApiKey +
                "&itmId=T22+T1+T4+T7+T21+&objL1=ALL&objL2=ALL&objL3=ALL&format=json&jsonVD=Y&prdSe=Y&newEstPrdCnt=3" +
                "&outputFields=ORG_ID+TBL_NM+OBJ_NM+NM+ITM_NM+UNIT_NM+PRD_SE+PRD_DE+LST_CHN_DE+&orgId=101&tblId=DT_1PEN_006&PRD_SE=2023";
    }

    private String buildContributionApiUrl() {
        return KOSIS_BASE_URL + "?method=getList&apiKey=" + kosisApiKey +
                "&itmId=T14&objL1=00&objL2=ALL&objL3=ALL&format=json&jsonVD=Y&prdSe=A&newEstPrdCnt=1" +
                "&orgId=101&tblId=DT_1PEN_017";
    }

    private String buildIrpApiUrl() {
        return KOSIS_BASE_URL + "?method=getList&apiKey=" + kosisApiKey +
                "&itmId=T01+T03+&objL1=ALL&objL2=ALL&format=json&jsonVD=Y&prdSe=Y&newEstPrdCnt=3" +
                "&outputFields=ORG_ID+TBL_ID+TBL_NM+OBJ_ID+OBJ_NM+NM+ITM_ID+ITM_NM+UNIT_NM+PRD_DE+&orgId=101&tblId=DT_1RP009";
    }



    /**
     * 국민연금 예상 연금액 계산
     * @param monthlyContribution 사용자가 납부하고자 하는 월 보험료
     * @return 국민연금 예상 연금액 계산 결과
     */
    public NationalPensionPredictionResponseDto calculateNationalPension(Long monthlyContribution) {
        log.info("국민연금 예상 연금액 계산 시작 - 월 보험료: {}원", monthlyContribution);
        
        final long NATIONAL_AVERAGE_INCOME = 3_106_680L; // 연금수급 전 3년간 전체 가입자의 평균 소득월액
        final double COEFFICIENT = 0.1; // 개인 및 전체 소득(A, B)에 공통으로 적용되는 계수
        final double CONTRIBUTION_RATE = 0.09; // 보험료율
        
        long bValueCap = Math.round(monthlyContribution / CONTRIBUTION_RATE);
        double pensionAt20Years = (NATIONAL_AVERAGE_INCOME + bValueCap) * COEFFICIENT;
        Map<String, Long> pensionAmountsByPeriod = new LinkedHashMap<>();
        int[] contributionPeriods = {10, 15, 20, 25, 30, 35, 40};
        
        for (int totalYears : contributionPeriods) {
            double calculatedPension;
            if (totalYears <= 20) {
                calculatedPension = pensionAt20Years * (totalYears / 20.0);
            } else {
                int extraYears = totalYears - 20;
                calculatedPension = pensionAt20Years * (1 + 0.05 * extraYears);
            }
            
            // 상한선 적용 및 10원 단위 반올림
            long finalPension = Math.min(Math.round(calculatedPension), bValueCap);
            pensionAmountsByPeriod.put(String.valueOf(totalYears)+"년", (finalPension / 10) * 10);
        }
        
        log.info("국민연금 예상 연금액 계산 완료 - 월 보험료: {}원, 20년 기준 연금액: {}원", 
                monthlyContribution, Math.round(pensionAt20Years));
        
        return NationalPensionPredictionResponseDto.builder()
                .monthlyContribution(monthlyContribution)
                .pensionAmountsByPeriod(pensionAmountsByPeriod)
                .nationalAverageIncome(NATIONAL_AVERAGE_INCOME)
                .personalIncomeCap(bValueCap)
                .build();
    }
}
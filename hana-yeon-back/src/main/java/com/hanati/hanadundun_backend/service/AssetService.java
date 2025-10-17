package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.asset.AssetIntegrationResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetService {

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final AuthAccessTokenManager authAccessTokenManager;

    @Value("${openbanking.base-url:http://localhost:8081}")
    private String openBankingBaseUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // 은행 코드 매핑 (bankCodeStd -> bankName)
    private static final Map<String, String> BANK_CODE_MAP = Map.of(
            "081", "하나은행",
            "088", "신한은행",
            "004", "KB국민은행",
            "011", "NH농협은행",
            "020", "우리은행",
            "436","DB생명"
    );
    

    public AssetIntegrationResponseDto getIntegratedAssets(String userId) {
        try {
            User user = userService.findByUserId(Long.parseLong(userId));

            log.info("통합 자산 조회 시작 - 사용자: {}", user.getUserName());

            List<AssetIntegrationResponseDto.AccountInfo> accountList = getExternalAccountList(user.getUserCi());

            List<AssetIntegrationResponseDto.InsuranceInfo> insuranceList = getInsuranceList(user.getUserCi());

            AssetIntegrationResponseDto response = AssetIntegrationResponseDto.builder()
                    .totalLength(accountList.size() + insuranceList.size())
                    .accountCount(accountList.size())
                    .insuranceCount(insuranceList.size())
                    .accountList(accountList)
                    .insuranceList(insuranceList)
                    .build();

            log.info("통합 자산 조회 완료 - 계좌: {}건, 보험: {}건", accountList.size(), insuranceList.size());
            return response;

        } catch (Exception e) {
            log.error("통합 자산 조회 실패", e);
            throw new RuntimeException("통합 자산 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    private List<AssetIntegrationResponseDto.AccountInfo> getExternalAccountList(String userCi) {
        try {
            String url = openBankingBaseUrl + "/oauth/2.0/accountinfo/num_list";

            Map<String, Object> requestBody = Map.of(
                    "userCi", userCi,
                    "ainfoAgreeYn", "Y",
                    "inquiryBankType", "1",
                    "traceNo", generateTraceNo(),
                    "inquiryRecordCnt", "30"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("계좌 조회 API 호출: {}", url);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = responseBody != null ? (Boolean) responseBody.get("success") : false;

                if (Boolean.TRUE.equals(success) && responseBody != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> resList = (List<Map<String, Object>>) data.get("resList");
                        if (resList != null) {
                            return resList.stream()
                                    .map(this::convertToAccountInfo)
                                    .collect(Collectors.toList());
                        }
                    }
                }
            }

            log.warn("계좌 조회 API 응답이 예상과 다름: {}", response.getBody());
            return new ArrayList<>();

        } catch (Exception e) {
            log.error("계좌 조회 API 호출 실패", e);
            return new ArrayList<>();
        }
    }

    private List<AssetIntegrationResponseDto.InsuranceInfo> getInsuranceList(String userCi) {
        try {
            String url = openBankingBaseUrl + "/v2.0/insurances";

            Map<String, Object> requestBody = Map.of(
                    "bankTranId", "BANKTRAN" + System.currentTimeMillis(),
                    "userCi", userCi,
                    "bankCodeStd", "436"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("보험 조회 API 호출: {}", url);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = responseBody != null ? (Boolean) responseBody.get("success") : false;

                if (Boolean.TRUE.equals(success) && responseBody != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> insuList = (List<Map<String, Object>>) data.get("insuList");
                        if (insuList != null) {
                            return insuList.stream()
                                    .map(this::convertToInsuranceInfo)
                                    .collect(Collectors.toList());
                        }
                    }
                }
            }

            log.warn("보험 조회 API 응답이 예상과 다름: {}", response.getBody());
            return new ArrayList<>();

        } catch (Exception e) {
            log.error("보험 조회 API 호출 실패", e);
            return new ArrayList<>();
        }
    }

    private AssetIntegrationResponseDto.AccountInfo convertToAccountInfo(Map<String, Object> accountData) {
        String bankCodeStd = (String) accountData.get("bankCodeStd");
        String bankName = BANK_CODE_MAP.getOrDefault(bankCodeStd, "기타은행");

        return AssetIntegrationResponseDto.AccountInfo.builder()
                .bankcode(bankCodeStd)
                .bankName(bankName)
                .productName((String) accountData.get("productName"))
                .productSubName((String) accountData.get("productSubName"))
                .accountType((String) accountData.get("accountType"))
                .accountNum((String) accountData.get("accountNum"))
                .accountSeq((String) accountData.get("accountSeq"))
                .accountIssueDate((String) accountData.get("accountIssueDate"))
                .lastTranDate((String) accountData.get("lastTranDate"))
                .dormancyYn((String) accountData.get("dormancyYn"))
                .build();
    }

    private AssetIntegrationResponseDto.InsuranceInfo convertToInsuranceInfo(Map<String, Object> insuranceData) {
        return AssetIntegrationResponseDto.InsuranceInfo.builder()
                .insuNum((String) insuranceData.get("insuNum"))
                .productName((String) insuranceData.get("prodName"))
                .insuType((String) insuranceData.get("insuType"))
                .insuranceCompany((String) insuranceData.get("insuranceCompany"))
                .bankCodeStd("436") // DB생명 보험사 코드
                .build();
    }

    private String generateTraceNo() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
}
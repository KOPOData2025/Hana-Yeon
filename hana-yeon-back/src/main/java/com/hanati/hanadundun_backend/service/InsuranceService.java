package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.insurance.*;
import com.hanati.hanadundun_backend.dto.insurance.InsuranceDto;
import com.hanati.hanadundun_backend.dto.insurance.InsuranceListResponseDto;
import com.hanati.hanadundun_backend.dto.insurance.RegisterInsuranceRequestDto;
import com.hanati.hanadundun_backend.dto.insurance.RegisterInsuranceResponseDto;
import com.hanati.hanadundun_backend.entity.Asset;
import com.hanati.hanadundun_backend.entity.InsuranceDetail;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.repository.AssetRepository;
import com.hanati.hanadundun_backend.repository.InsuranceDetailRepository;
import com.hanati.hanadundun_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsuranceService {

    private final AssetRepository assetRepository;
    private final InsuranceDetailRepository insuranceDetailRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final AuthAccessTokenManager authAccessTokenManager;

    @Value("${openbanking.base-url:http://localhost:8082}")
    private String openBankingBaseUrl;

    public RegisterInsuranceResponseDto registerInsurances(String userCi, RegisterInsuranceRequestDto request) {
        log.info("보험 등록 요청 처리 시작 - userCi: {}", userCi);
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<RegisterInsuranceResponseDto.InsuranceRegistrationResultDto> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        for (RegisterInsuranceRequestDto.InsuranceRegistrationDto insuranceDto : request.getInsuranceList()) {
            RegisterInsuranceResponseDto.InsuranceRegistrationResultDto result = registerSingleInsurance(user, insuranceDto);
            results.add(result);
            
            if (result.isSuccess()) {
                successCount++;
            } else {
                failureCount++;
            }
        }
        
        return new RegisterInsuranceResponseDto(results, successCount, failureCount);
    }

    @Transactional
    private RegisterInsuranceResponseDto.InsuranceRegistrationResultDto registerSingleInsurance(User user, RegisterInsuranceRequestDto.InsuranceRegistrationDto insuranceDto) {
        try {
            // 중복 체크
            List<InsuranceDetail> existingInsurances = insuranceDetailRepository.findByUserIdAndInstitutionCodeAndProductName(
                user.getUserId(), insuranceDto.getBankCodeStd(), insuranceDto.getProductName()
            );
            
            if (!existingInsurances.isEmpty()) {
                log.info("이미 등록된 보험입니다 - productName: {}", insuranceDto.getProductName());
                return RegisterInsuranceResponseDto.InsuranceRegistrationResultDto.builder()
                    .bankCodeStd(insuranceDto.getBankCodeStd())
                    .insuNum(insuranceDto.getInsuNum())
                    .productName(insuranceDto.getProductName())
                    .insuType(insuranceDto.getInsuType())
                    .insuranceCompany(insuranceDto.getInsuranceCompany())
                    .rspCode("DUPLICATE_INSURANCE")
                    .rspMessage("이미 등록된 보험입니다.")
                    .success(false)
                    .build();
            }
            
            // Asset 테이블에 저장
            Long categoryCode = mapInsuranceCategoryCode(insuranceDto.getInsuType());
            Asset asset = new Asset(user.getUserId(), "INSURANCE", categoryCode);
            Asset savedAsset = assetRepository.save(asset);
            
            // InsuranceDetail 테이블에 저장
            InsuranceDetail insuranceDetail = new InsuranceDetail(
                savedAsset.getAssetId(),
                user.getUserId(),
                insuranceDto.getBankCodeStd(),
                insuranceDto.getProductName(),
                mapInsuranceType(insuranceDto.getInsuType()), 
                "ACTIVE", // 기본 상태를 ACTIVE
                BigDecimal.ZERO, 
                LocalDate.now(), 
                LocalDate.now().plusYears(10) 
            );
            
            insuranceDetailRepository.save(insuranceDetail);
            
            log.info("보험 등록 성공 - productName: {}", insuranceDto.getProductName());
            
            return RegisterInsuranceResponseDto.InsuranceRegistrationResultDto.builder()
                .bankCodeStd(insuranceDto.getBankCodeStd())
                .insuNum(insuranceDto.getInsuNum())
                .productName(insuranceDto.getProductName())
                .insuType(insuranceDto.getInsuType())
                .insuranceCompany(insuranceDto.getInsuranceCompany())
                .rspCode("A0000")
                .rspMessage("성공")
                .success(true)
                .build();
            
        } catch (Exception e) {
            log.error("보험 등록 실패 - productName: {}, error: {}", insuranceDto.getProductName(), e.getMessage());
            return RegisterInsuranceResponseDto.InsuranceRegistrationResultDto.builder()
                .bankCodeStd(insuranceDto.getBankCodeStd())
                .insuNum(insuranceDto.getInsuNum())
                .productName(insuranceDto.getProductName())
                .insuType(insuranceDto.getInsuType())
                .insuranceCompany(insuranceDto.getInsuranceCompany())
                .rspCode("E0001")
                .rspMessage("등록 실패: " + e.getMessage())
                .success(false)
                .build();
        }
    }

    public InsuranceListResponseDto getAllInsurances(String userCi) {
        log.info("전체 보험 조회 요청 - userCi: {}", userCi);
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<InsuranceDetail> insuranceDetails = insuranceDetailRepository.findByUserId(user.getUserId());
        List<InsuranceDto> insuranceDtos = new ArrayList<>();
        
        // 보험사별 중복 제거 (같은 보험사에 대해 여러 번 API 호출 방지)
        Set<String> processedInstitutions = new HashSet<>();
        
        for (InsuranceDetail insuranceDetail : insuranceDetails) {
            String institutionCode = insuranceDetail.getInstitutionCode();
            
            // 이미 처리한 보험사는 스킵
            if (processedInstitutions.contains(institutionCode)) {
                log.debug("보험사 {}는 이미 처리됨 - 스킵", institutionCode);
                continue;
            }
            
            try {
                // 각 보험사별로 openBanking API 호출하여 실제 데이터 조회
                List<InsuranceDto> insuranceFromOpenBanking = getInsuranceFromOpenBanking(userCi, institutionCode);
                insuranceDtos.addAll(insuranceFromOpenBanking);
                
                processedInstitutions.add(institutionCode);
                log.info("보험사 {} 데이터 조회 완료 - {} 건", institutionCode, insuranceFromOpenBanking.size());
                
            } catch (Exception e) {
                log.error("보험사 {}의 데이터 조회 실패: {}", institutionCode, e.getMessage());
            }
        }
        
        return new InsuranceListResponseDto(insuranceDtos);
    }
    
    private List<InsuranceDto> getInsuranceFromOpenBanking(String userCi, String institutionCode) {
        String apiUrl = openBankingBaseUrl + "/v2.0/insurances";
        
        OpenBankingInsuranceRequest request = new OpenBankingInsuranceRequest();
        request.setBankTranId("HANADUNDUN" + System.currentTimeMillis());
        request.setUserCi(userCi);
        request.setBankCodeStd(institutionCode);
        
        String authToken = authAccessTokenManager.getAuthAccessToken();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authToken); 
        HttpEntity<OpenBankingInsuranceRequest> entity = new HttpEntity<>(request, headers);
        
        try {
            log.debug("OpenBanking API 호출 - URL: {}, institutionCode: {}", apiUrl, institutionCode);
            
            OpenBankingInsuranceResponse response = restTemplate.postForObject(apiUrl, entity, OpenBankingInsuranceResponse.class);
            
            if (response != null && response.isSuccess()) {
                log.info("OpenBanking API 호출 성공 - institutionCode: {}, 건수: {}", 
                        institutionCode, response.getData().getInsuList().size());
                return response.getData().getInsuList().stream()
                    .map(openBankingInfo -> convertToInsuranceDto(openBankingInfo, institutionCode))
                    .collect(Collectors.toList());
            } else {
                log.warn("OpenBanking API 호출 실패 - institutionCode: {}, response: {}", institutionCode, response);
                return new ArrayList<>();
            }
        } catch (Exception e) {
            log.error("OpenBanking API 호출 중 오류 발생 - institutionCode: {}, error: {}", institutionCode, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private InsuranceDto convertToInsuranceDto(OpenBankingInsuranceInfo openBankingInfo,String institutionCode) {
        InsuranceDto dto = new InsuranceDto();
        dto.setInstitutionCode(institutionCode);
        dto.setInsuNum(openBankingInfo.getInsuNum()); 
        dto.setProdName(openBankingInfo.getProdName());
        dto.setInsuType(openBankingInfo.getInsuType());
        dto.setInsuranceCompany(openBankingInfo.getInsuranceCompany());
        dto.setInsuStatus(openBankingInfo.getInsuStatus());
        dto.setIssueDate(openBankingInfo.getIssueDate());
        dto.setExpDate(openBankingInfo.getExpDate());
        dto.setMonthlyPremium(openBankingInfo.getMonthlyPremium()); 
        return dto;
    }
    
    // OpenBanking API 요청/응답 DTO 내부 클래스
    private static class OpenBankingInsuranceRequest {
        private String bankTranId;
        private String userCi;
        private String bankCodeStd;
        
        public String getBankTranId() { return bankTranId; }
        public void setBankTranId(String bankTranId) { this.bankTranId = bankTranId; }
        public String getUserCi() { return userCi; }
        public void setUserCi(String userCi) { this.userCi = userCi; }
        public String getBankCodeStd() { return bankCodeStd; }
        public void setBankCodeStd(String bankCodeStd) { this.bankCodeStd = bankCodeStd; }
    }
    
    private static class OpenBankingInsuranceResponse {
        private int status;
        private boolean success;
        private String message;
        private OpenBankingInsuranceData data;
        
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public OpenBankingInsuranceData getData() { return data; }
        public void setData(OpenBankingInsuranceData data) { this.data = data; }
    }
    
    private static class OpenBankingInsuranceData {
        private int insuCnt;
        private List<OpenBankingInsuranceInfo> insuList;
        
        public int getInsuCnt() { return insuCnt; }
        public void setInsuCnt(int insuCnt) { this.insuCnt = insuCnt; }
        public List<OpenBankingInsuranceInfo> getInsuList() { return insuList; }
        public void setInsuList(List<OpenBankingInsuranceInfo> insuList) { this.insuList = insuList; }
    }
    
    private static class OpenBankingInsuranceInfo {
        private String insuNum;
        private String prodName;
        private String insuType;
        private String insuranceCompany;
        private String insuStatus;
        private String issueDate;
        private String expDate;
        private Integer monthlyPremium;
        
        public String getInsuNum() { return insuNum; }
        public void setInsuNum(String insuNum) { this.insuNum = insuNum; }
        public String getProdName() { return prodName; }
        public void setProdName(String prodName) { this.prodName = prodName; }
        public String getInsuType() { return insuType; }
        public void setInsuType(String insuType) { this.insuType = insuType; }
        public String getInsuranceCompany() { return insuranceCompany; }
        public void setInsuranceCompany(String insuranceCompany) { this.insuranceCompany = insuranceCompany; }
        public String getInsuStatus() { return insuStatus; }
        public void setInsuStatus(String insuStatus) { this.insuStatus = insuStatus; }
        public String getIssueDate() { return issueDate; }
        public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
        public String getExpDate() { return expDate; }
        public void setExpDate(String expDate) { this.expDate = expDate; }
        public Integer getMonthlyPremium() { return monthlyPremium; }
        public void setMonthlyPremium(Integer monthlyPremium) { this.monthlyPremium = monthlyPremium; }
    }


    // 보험 타입을 DB 제약조건에 맞게 매핑
   private String mapInsuranceType(String insuTypeCode) {
        if (insuTypeCode == null || insuTypeCode.trim().isEmpty()) {
            return "ETC";
        }
        
        String code = insuTypeCode.trim();
        
        // DB 제약조건: 'LIFE', 'HEALTH', 'CAR', 'ETC'
        switch (code) {
            case "01": // 종신보험
            case "02": // 정기보험
            case "09": // 연금저축보험
            case "10": // 저축보험
            case "11": // 저축보험 (양로보험 포함)
                return "LIFE";
            
            case "03": // 질병(건강) 보험
            case "04": // 상해보험
            case "05": // 암보험
            case "06": // 간병(요양) 보험
            case "07": // 어린이보험
            case "08": // 치아보험
            case "16": // 실손의료보험
            case "22": // 종합보장보험
                return "HEALTH";
            
            case "13": // 운전자보험
            case "17": // 자동차보험
                return "CAR";
            
            case "12": // 교육보험
            case "14": // 여행자보험
            case "15": // 골프보험
            case "18": // 화재/재물보험
            case "19": // 배상책임보험
            case "20": // 보증(신용) 보험
            case "21": // 펫보험
            case "99": // 기타보험
            default:
                return "ETC"; // 목록에 없는 모든 코드는 ETC로 처리
        }
    }

    /**
     * 보험 타입에 따라 카테고리 코드 매핑
     */
    private Long mapInsuranceCategoryCode(String insuType) {
        if (insuType == null || insuType.trim().isEmpty()) {
            return 15L;
        }
        
        String code = insuType.trim();
        
        switch (code) {
            case "09": // 연금저축보험
                return 7L;
            
            case "02": // 정기보험
            case "10": // 저축보험
            case "11": // 저축보험(양로보험 포함)
                return 8L; 
            
            case "03": // 질병(건강) 보험
            case "04": // 상해보험
            case "05": // 암보험
            case "06": // 간병(요양) 보험
            case "07": // 어린이보험
            case "08": // 치아보험
            case "16": // 실손의료보험
            case "22": // 종합보장보험
                return 9L; 
            
            case "01": // 종신보험
                return 10L;
            
            case "13": // 운전자보험
            case "17": // 자동차보험
                return 11L;
            
            case "12": // 교육보험
            case "14": // 여행자보험
            case "15": // 골프보험
            case "18": // 화재/재물보험
            case "19": // 배상책임보험
            case "20": // 보증(신용) 보험
            case "21": // 펫보험
            case "99": // 기타보험
            default:
                // 목록에 없는 코드나 기타 입력은 15L로 처리
                return 15L; 
        }
    }
}
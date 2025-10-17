package com.hanati.open_banking_backend.domain.insurance.service;

import com.hanati.open_banking_backend.domain.insurance.dto.request.ExternalInsuRequest;
import com.hanati.open_banking_backend.domain.insurance.dto.request.InsuranceListRequest;
import com.hanati.open_banking_backend.domain.insurance.dto.response.ExternalInsuResponse;
import com.hanati.open_banking_backend.domain.insurance.dto.response.InsuranceListResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsuranceService {

    private final RestTemplate restTemplate;

    @Value("${dbLife.base-url}")
    private String dbLifeBaseUrl;
    
    // 보험사 엔드포인트 매핑 (보험 계약 관련만)
    private Map<String, List<String>> getInsuranceEndpointMapping() {
        Map<String, List<String>> mapping = new HashMap<>();
        // 단일 값을 배열로 변환 (추후 보험사 추가 가능)
        mapping.put("436", Arrays.asList(dbLifeBaseUrl)); // DB생명
        return mapping;
    }

    public InsuranceListResponse getInsuranceList(InsuranceListRequest request) {
        // 1. userCi로 User를 찾아 userSeqNo 조회 (내부적으로 사용)
        // String userSeqNo = userService.getUserSeqNoByUserCi(request.getUserCi()); // 현재 사용하지 않음
        String userCi = request.getUserCi();

        // 2. bankCodeStd로 적절한 endpoint 조회 (보험사만)
        Map<String, List<String>> insuranceEndpointMapping = getInsuranceEndpointMapping();
        List<String> baseUrls = insuranceEndpointMapping.get(request.getBankCodeStd());
        if (baseUrls == null || baseUrls.isEmpty()) {
            throw new IllegalArgumentException("지원하지 않는 보험사 코드입니다. bankCodeStd: " + request.getBankCodeStd());
        }

        // 3. 모든 보험사 API 호출 및 결과 통합
        List<InsuranceListResponse.InsuInfo> allInsuList = new ArrayList<>();
        int totalInsuCnt = 0;
        
        for (String baseUrl : baseUrls) {
            try {
                String externalApiUrl = baseUrl + "/api/v1/contracts/all";
                
                ExternalInsuRequest externalRequest = new ExternalInsuRequest(userCi);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<ExternalInsuRequest> entity = new HttpEntity<>(externalRequest, headers);

                ExternalInsuResponse externalResponse = restTemplate.postForObject(externalApiUrl, entity, ExternalInsuResponse.class);

                if (externalResponse != null && externalResponse.isSuccess()) {
                    totalInsuCnt += externalResponse.getInsuCnt();
                    
                    List<InsuranceListResponse.InsuInfo> insuList = externalResponse.getData().stream().map(data ->
                            InsuranceListResponse.InsuInfo.builder()
                                    .insuNum(data.getInsuNum())
                                    .prodName(data.getProductName())
                                    .insuType(data.getInsuType())
                                    .insuranceCompany(data.getInsuranceCompany())
                                    .insuStatus(data.getInsuStatus())
                                    .issueDate(data.getIssueDate().replaceAll("-", ""))
                                    .expDate(data.getExpDate().replaceAll("-", ""))
                                    .monthlyPremium(data.getMonthlyPremium())
                                    .build()
                    ).collect(Collectors.toList());
                    
                    allInsuList.addAll(insuList);
                    log.info("보험사 API 조회 성공 - URL: {}, 조회 건수: {}", externalApiUrl, insuList.size());
                } else {
                    log.warn("보험사 API 호출 실패 - URL: {}", externalApiUrl);
                }
            } catch (Exception e) {
                log.error("보험사 API 호출 오류 - URL: {}, 오류: {}", baseUrl, e.getMessage());
                // 하나의 API가 실패해도 다른 API로 계속 진행
            }
        }

        // 4. 외부 응답을 우리 API 응답 형식으로 변환
        return InsuranceListResponse.builder()
                .insuCnt(totalInsuCnt)
                .insuList(allInsuList)
                .build();
    }
} 
package com.hanati.open_banking_backend.domain.bank.service;

import com.hanati.open_banking_backend.domain.bank.entity.BankCode;
import com.hanati.open_banking_backend.domain.bank.repository.BankCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class BankCodeService {
    
    private final BankCodeRepository bankCodeRepository;
    
    @Value("${hanaBank.base-url}")
    private String hanaBankBaseUrl;
    
    @Value("${shinhanBank.base-url}")
    private String shinhanBankBaseUrl;
    
    @Value("${dbLife.base-url}")
    private String dbLifeBaseUrl;
    
    /**
     * 은행 코드별 기관명 매핑을 DB에서 조회하여 반환
     * @return 은행 코드 -> 기관명 매핑 Map
     */
    public Map<String, String> getInstitutionNameMapping() {
        log.info("DB에서 은행 코드별 기관명 매핑 조회 시작");
        
        List<BankCode> bankCodes = bankCodeRepository.findAll();
        Map<String, String> mapping = new HashMap<>();
        
        for (BankCode bankCode : bankCodes) {
            if (bankCode.getBankCodeStd() != null && bankCode.getBankName() != null) {
                mapping.put(bankCode.getBankCodeStd(), bankCode.getBankName());
                log.debug("은행 코드 매핑 추가 - {}: {}", bankCode.getBankCodeStd(), bankCode.getBankName());
            }
        }
        
        log.info("DB에서 은행 코드별 기관명 매핑 조회 완료 - 총 {}개 매핑", mapping.size());
        return mapping;
    }
    
    /**
     * 특정 은행 코드로 기관명 조회
     * @param bankCodeStd 은행 코드
     * @return 기관명 (없으면 null)
     */
    public String getInstitutionName(String bankCodeStd) {
        if (bankCodeStd == null) {
            return null;
        }
        
        return bankCodeRepository.findById(bankCodeStd)
                .map(BankCode::getBankName)
                .orElse(null);
    }
    
    /**
     * 은행 엔드포인트 매핑 (계좌 관련 서비스만)
     * @return 은행 코드 -> 엔드포인트 URL 매핑 Map
     */
    public Map<String, String> getBankEndpointMapping() {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("081", hanaBankBaseUrl); // 하나은행
        mapping.put("088", shinhanBankBaseUrl); // 신한은행
        return mapping;
    }
    
    /**
     * 보험사 엔드포인트 매핑 (보험 계약 관련)
     * @return 보험사 코드 -> 엔드포인트 URL 매핑 Map
     */
    public Map<String, String> getInsuranceEndpointMapping() {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("436", dbLifeBaseUrl); // DB생명
        return mapping;
    }
}
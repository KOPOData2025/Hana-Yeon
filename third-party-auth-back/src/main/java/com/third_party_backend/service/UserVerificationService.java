package com.third_party_backend.service;

import com.third_party_backend.dto.UserVerificationRequest;
import com.third_party_backend.dto.UserVerificationResponse;
import com.third_party_backend.utils.CiHashing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j

public class UserVerificationService {
    
    private final SmsCertificationService smsCertificationService;
    private final CiHashing ciHashing;

    private final ConcurrentHashMap<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    @Autowired
    public UserVerificationService(SmsCertificationService smsCertificationService, CiHashing ciHashing) {
        this.smsCertificationService = smsCertificationService;
        this.ciHashing = ciHashing;
    }

    public UserVerificationResponse sendVerificationCode(UserVerificationRequest request) {
        try {
            log.info("SMS 인증 코드 발송 요청 - 이름: {}, 전화번호: {}", request.getUserName(), request.getUserPhone());
            
            // 주민번호 유효성 검증
            if (!ciHashing.validateResidentNumber(request.getUserNum())) {
                return UserVerificationResponse.failure("주민번호 형식이 올바르지 않습니다.");
            }
            
            // 6자리 랜덤 인증 코드 생성
            String verificationCode = generateVerificationCode();
            
            // 인증 코드를 저장 (5분 후 자동 삭제)
            verificationCodes.put(request.getUserPhone(), verificationCode);
            scheduler.schedule(() -> verificationCodes.remove(request.getUserPhone()), 5, TimeUnit.MINUTES);
            
            // SMS 인증 코드 발송 (전화번호, 인증코드)
            smsCertificationService.sendVerificationCode(request.getUserPhone(), verificationCode);
            
            log.info("SMS 인증 코드 발송 완료 - 전화번호: {}", request.getUserPhone());
            
            return UserVerificationResponse.smsSent(request.getUserPhone(),verificationCode);
        } catch (Exception e) {
            log.error("SMS 인증 코드 발송 중 오류 발생", e);
            return UserVerificationResponse.failure("SMS 인증 코드 발송에 실패했습니다.");
        }
    }

    public UserVerificationResponse verifyUserAndGenerateCi(UserVerificationRequest request) {
        try {
            log.info("사용자 인증 및 CI 생성 요청 - 이름: {}, 전화번호: {}", 
                    request.getUserName(), request.getUserPhone());
            
            // 필수 정보 확인
            if (request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
                return UserVerificationResponse.failure("인증 코드를 입력해주세요.");
            }
            
            // 주민번호 유효성 검증
            if (!ciHashing.validateResidentNumber(request.getUserNum())) {
                return UserVerificationResponse.failure("주민번호 형식이 올바르지 않습니다.");
            }
            
            // SMS 인증 코드 검증
            if (!verifyCode(request.getUserPhone(), request.getVerifyCode())) {
                log.warn("SMS 인증 실패 - 전화번호: {}, 입력된 코드: {}", 
                        request.getUserPhone(), request.getVerifyCode());
                return UserVerificationResponse.failure("인증 코드가 올바르지 않거나 만료되었습니다.");
            }
            
            // 인증 성공 - CI 값 생성
            String ciValue = ciHashing.generateCiValue(request.getUserNum());
            
            log.info("사용자 인증 및 CI 생성 완료 - 이름: {}, 전화번호: {}, CI: {}", 
                    request.getUserName(), request.getUserPhone(),
                    ciHashing.maskCiValue(ciValue));
            
            return UserVerificationResponse.success(ciValue);
            
        } catch (Exception e) {
            log.error("사용자 인증 및 CI 생성 중 오류 발생", e);
            return UserVerificationResponse.failure("인증 처리 중 오류가 발생했습니다.");
        }
    }

    public boolean validateUserInfo(UserVerificationRequest request) {
        if (request == null) {
            return false;
        }
        
        if (request.getUserName() == null || request.getUserName().trim().length() < 2) {
            return false;
        }
        
        if (request.getUserPhone() == null || 
            !request.getUserPhone().matches("^010-\\d{4}-\\d{4}$")) {
            log.warn("전화번호 형식 오류: {}", request.getUserPhone());
            return false;
        }
        
        if (!ciHashing.validateResidentNumber(request.getUserNum())) {
            return false;
        }
        
        return true;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private boolean verifyCode(String phoneNumber, String inputCode) {
        String storedCode = verificationCodes.get(phoneNumber);
        if (storedCode != null && storedCode.equals(inputCode)) {
            verificationCodes.remove(phoneNumber);
            return true;
        }
        return false;
    }
} 
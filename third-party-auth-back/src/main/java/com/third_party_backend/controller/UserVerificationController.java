package com.third_party_backend.controller;

import com.third_party_backend.dto.UserVerificationRequest;
import com.third_party_backend.dto.UserVerificationResponse;
import com.third_party_backend.service.UserVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class UserVerificationController {
    
    private final UserVerificationService userVerificationService;
    
    @Autowired
    public UserVerificationController(UserVerificationService userVerificationService) {
        this.userVerificationService = userVerificationService;
    }

    @PostMapping("/send-sms")
    public ResponseEntity<UserVerificationResponse> sendVerificationCode(
            @Valid @RequestBody UserVerificationRequest request) {
        
        log.info("SMS 인증 코드 발송 API 호출 - 이름: {}, 전화번호: {}", 
                request.getUserName(), request.getUserPhone());
        
        try {
            if (!userVerificationService.validateUserInfo(request)) {
                return ResponseEntity.badRequest()
                        .body(UserVerificationResponse.failure("입력된 사용자 정보가 올바르지 않습니다."));
            }
            
            UserVerificationResponse response = userVerificationService.sendVerificationCode(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("SMS 인증 코드 발송 API 처리 중 오류", e);
            return ResponseEntity.internalServerError()
                    .body(UserVerificationResponse.failure("서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/certify-user-ci")
    public ResponseEntity<UserVerificationResponse> verifyUserAndGenerateCi(
            @Valid @RequestBody UserVerificationRequest request) {
        
        log.info("사용자 인증 및 CI 생성 API 호출 - 이름: {}, 전화번호: {}", 
                request.getUserName(), request.getUserPhone());
        
        try {
            if (!userVerificationService.validateUserInfo(request)) {
                return ResponseEntity.badRequest()
                        .body(UserVerificationResponse.failure("입력된 사용자 정보가 " +
                                "올바르지 않습니다."));
            }
            
            UserVerificationResponse response = userVerificationService.verifyUserAndGenerateCi(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("사용자 인증 및 CI 생성 API 처리 중 오류", e);
            return ResponseEntity.internalServerError()
                    .body(UserVerificationResponse.failure("서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("User Verification Service is running");
    }
} 
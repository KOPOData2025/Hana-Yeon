
package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.entity.UpbitUser;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.UserService;
import com.hanati.hanadundun_backend.service.UpbitApiService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/upbit")
@RequiredArgsConstructor
public class UpbitApiController {

    private static final Logger log = LoggerFactory.getLogger(UpbitApiController.class);
    private final UpbitApiService upbitApiService;
    private final UserService userService;
    
   
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    /**
     * 가상화폐 정보 조회 
     * - Upbit API 키가 등록되어 있으면 계좌 정보 반환
     * - 등록되어 있지 않으면 키 등록이 필요하다는 응답 반환
     */
    @GetMapping("/virtual")
    public ResponseEntity<?> getVirtualCurrency() {
        try {
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            log.info("user: {}", user);
            log.info("user id: {}", user.getUserId());
            
            boolean hasKeys = upbitApiService.hasUpbitKeys(user.getUserId());
            log.info("hasKeys: {}", hasKeys);
            
            if (!hasKeys) {
                return ResponseEntity.ok(Map.of(
                    "requiresKeyRegistration", true,
                    "message", "Upbit API 키를 먼저 등록해주세요."
                ));
            }
            
            String accounts = upbitApiService.getAccounts(user.getUserId());
            return ResponseEntity.ok(Map.of(
                "requiresKeyRegistration", false,
                "accounts", accounts
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "가상화폐 정보 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // Upbit API 키 등록
    @PostMapping("/keys")
    public ResponseEntity<?> registerUpbitKeys(
            @RequestBody Map<String, String> keyRequest) {
        try {   
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            String accessKey = keyRequest.get("accessKey");
            String secretKey = keyRequest.get("secretKey");
            
            if (accessKey == null || secretKey == null || accessKey.trim().isEmpty() || secretKey.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Access Key와 Secret Key를 모두 입력해주세요."));
            }

            UpbitUser upbitUser = upbitApiService.registerUpbitKeys(user.getUserId(), accessKey, secretKey);
            return ResponseEntity.ok(Map.of(
                "message", "Upbit API 키가 성공적으로 등록되었습니다.",
                "upbitUserId", upbitUser.getUserId()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "API 키 등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // 사용자의 Upbit API 키 정보 조회
    @GetMapping("/keys")
    public ResponseEntity<?> getUpbitUser() {
        try {
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            UpbitUser upbitUser = upbitApiService.getUpbitUser(user.getUserId());
            return ResponseEntity.ok(upbitUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "API 키 정보 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // Upbit API 키 삭제
    public ResponseEntity<?> deleteUpbitKeys() {
        try {
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            upbitApiService.deleteUpbitKeys(user.getUserId());
            return ResponseEntity.ok(Map.of("message", "Upbit API 키가 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "API 키 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

}
package com.hanati.hanabank_backend.domain.user.controller;

import com.hanati.hanabank_backend.domain.user.dto.UserCreateRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserDeleteRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserResponse;
import com.hanati.hanabank_backend.domain.user.dto.UserSearchRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserUpdateRequest;
import com.hanati.hanabank_backend.domain.user.service.UserService;
import com.hanati.hanabank_backend.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    // 사용자 생성
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserCreateRequest request) {
        log.info("사용자 생성 요청 - CI: {}", request.getUserCi());
        try {
            UserResponse response = userService.createUser(request);
            log.info("사용자 생성 성공 - UserId: {}", response.getUserId());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("사용자 생성 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("사용자 생성 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("사용자 생성 중 오류가 발생했습니다."));
        }
    }
    
    // CI로 사용자 조회
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<UserResponse>> searchUserByCi(@RequestBody UserSearchRequest request) {
        log.info("사용자 조회 요청 - CI: {}", request.getUserCi());
        try {
            UserResponse response = userService.searchUserByCi(request);
            log.info("사용자 조회 성공 - UserId: {}", response.getUserId());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("사용자 조회 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("사용자 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("사용자 조회 중 오류가 발생했습니다."));
        }
    }
    
    // CI로 사용자 수정
    @PutMapping
    public ResponseEntity<ApiResponse<UserResponse>> updateUserByCi(@RequestBody UserUpdateRequest request) {
        log.info("사용자 수정 요청 - CI: {}", request.getUserCi());
        try {
            UserResponse response = userService.updateUserByCi(request);
            log.info("사용자 수정 성공 - UserId: {}", response.getUserId());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("사용자 수정 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("사용자 수정 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("사용자 수정 중 오류가 발생했습니다."));
        }
    }
    
    // CI로 사용자 삭제
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<String>> deleteUserByCi(@RequestBody UserDeleteRequest request) {
        log.info("사용자 삭제 요청 - CI: {}", request.getUserCi());
        try {
            userService.deleteUserByRequest(request);
            log.info("사용자 삭제 성공 - CI: {}", request.getUserCi());
            return ResponseEntity.ok(ApiResponse.success("사용자가 성공적으로 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            log.warn("사용자 삭제 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("사용자 삭제 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("사용자 삭제 중 오류가 발생했습니다."));
        }
    }
} 
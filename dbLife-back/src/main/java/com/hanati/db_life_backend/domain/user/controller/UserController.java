package com.hanati.db_life_backend.domain.user.controller;

import com.hanati.db_life_backend.domain.user.dto.UserCreateRequest;
import com.hanati.db_life_backend.domain.user.dto.UserResponse;
import com.hanati.db_life_backend.domain.user.entity.User;
import com.hanati.db_life_backend.domain.user.service.UserService;
import com.hanati.db_life_backend.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@RequestBody UserCreateRequest request) {
        // 중복 사용자 확인
        if (userService.existsByUserCi(request.getUserCi())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("이미 등록된 사용자입니다."));
        }
        
        // 사용자 등록
        User user = User.builder()
                .userCi(request.getUserCi())
                .userInfo(request.getUserInfo())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .username(request.getUsername())
                .build();
        
        User savedUser = userService.saveUser(user);
        
        UserResponse response = UserResponse.builder()
                .userCi(savedUser.getUserCi())
                .userInfo(savedUser.getUserInfo())
                .phoneNumber(savedUser.getPhoneNumber())
                .email(savedUser.getEmail())
                .username(savedUser.getUsername())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("사용자 등록이 완료되었습니다.", response));
    }
    
    @GetMapping("/{userCi}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String userCi) {
        return userService.findByUserCi(userCi)
                .map(user -> {
                    UserResponse response = UserResponse.builder()
                            .userCi(user.getUserCi())
                            .userInfo(user.getUserInfo())
                            .phoneNumber(user.getPhoneNumber())
                            .email(user.getEmail())
                            .username(user.getUsername())
                            .build();
                    return ResponseEntity.ok(ApiResponse.success("사용자 조회 성공", response));
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 
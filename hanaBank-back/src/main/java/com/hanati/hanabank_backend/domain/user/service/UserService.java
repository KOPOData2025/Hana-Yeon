package com.hanati.hanabank_backend.domain.user.service;

import com.hanati.hanabank_backend.domain.user.dto.UserCreateRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserDeleteRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserResponse;
import com.hanati.hanabank_backend.domain.user.dto.UserSearchRequest;
import com.hanati.hanabank_backend.domain.user.dto.UserUpdateRequest;
import com.hanati.hanabank_backend.domain.user.entity.User;
import com.hanati.hanabank_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserResponse createUser(UserCreateRequest request) {
        // CI 중복 체크
        if (userRepository.existsByUserCi(request.getUserCi())) {
            throw new IllegalArgumentException("이미 존재하는 CI입니다.");
        }
        
        // User 엔티티 생성
        User user = User.builder()
                .userId(generateUserId())
                .userCi(request.getUserCi())
                .userNum(request.getUserNum())
                .username(request.getUsername())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("사용자 생성 완료: CI={}", request.getUserCi());
        
        return convertToResponse(savedUser);
    }
    
    @Transactional(readOnly = true)
    public UserResponse searchUserByCi(UserSearchRequest request) {
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        return convertToResponse(user);
    }
    
    public UserResponse updateUserByCi(UserUpdateRequest request) {
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        User updatedUser = User.builder()
                .userId(user.getUserId())
                .userCi(user.getUserCi())
                .userNum(user.getUserNum())
                .username(request.getUsername() != null ? request.getUsername() : user.getUsername())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : user.getPhoneNumber())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
        
        User savedUser = userRepository.save(updatedUser);
        log.info("사용자 업데이트 완료: CI={}", request.getUserCi());
        
        return convertToResponse(savedUser);
    }
    
    public void deleteUserByRequest(UserDeleteRequest request) {
        if (!userRepository.existsByUserCi(request.getUserCi())) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        
        userRepository.deleteByUserCi(request.getUserCi());
        log.info("사용자 삭제 완료: CI={}", request.getUserCi());
    }
    
    private String generateUserId() {
        return "USER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
    
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .userCi(user.getUserCi())
                .userNum(user.getUserNum())
                .username(user.getUsername())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
} 
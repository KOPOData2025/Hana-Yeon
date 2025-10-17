package com.hanati.hanabank_backend.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    
    private String userCi;
    
    private String username;
    
    private String phoneNumber;
    
    private String email;
} 
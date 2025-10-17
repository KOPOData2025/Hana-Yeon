package com.hanati.db_life_backend.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private String userCi;
    private String userInfo;
    private String phoneNumber;
    private String email;
    private String username;
} 
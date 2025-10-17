package com.hanati.db_life_backend.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    
    private String userCi;
    private String userInfo;
    private String phoneNumber;
    private String email;
    private String username;
} 
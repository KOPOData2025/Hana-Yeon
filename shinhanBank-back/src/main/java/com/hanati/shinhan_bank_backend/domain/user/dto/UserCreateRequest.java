package com.hanati.shinhan_bank_backend.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateRequest {
    
    private String userCi;
    
    @NotBlank(message = "사용자 번호는 필수입니다.")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "사용자 번호는 999999-9999999 형식이어야 합니다.")
    private String userNum;
    
    private String username;
    
    private String phoneNumber;
    
    private String email;
} 
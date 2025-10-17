package com.third_party_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVerificationRequest {
    
    @NotBlank(message = "이름을 입력해주세요.")
    private String userName;
    
    @NotBlank(message = "주민번호를 입력해주세요.")
    private String userNum;
    
    @NotBlank(message = "전화번호를 입력해주세요.")
    private String userPhone;

    private String verifyCode;
} 
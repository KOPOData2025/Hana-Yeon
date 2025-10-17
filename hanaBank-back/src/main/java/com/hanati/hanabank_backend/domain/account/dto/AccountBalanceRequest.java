package com.hanati.hanabank_backend.domain.account.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountBalanceRequest {
    
    @NotBlank(message = "사용자 CI는 필수입니다.")
    private String userCi;
    
    @NotBlank(message = "계좌번호는 필수입니다.")
    private String accountNum;
} 
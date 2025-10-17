package com.hanati.hanabank_backend.domain.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountSearchByUserNumRequest {
    
    @NotBlank(message = "사용자 번호는 필수입니다.")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "사용자 번호는 999999-9999999 형식이어야 합니다.")
    private String userNum;
} 
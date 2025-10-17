package com.hanati.hanadundun_backend.dto.account;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterAccountResponseDto {
    
    private List<AccountRegistrationResultDto> results;
    private Integer successCount;
    private Integer failureCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountRegistrationResultDto {
        private String bankcode;
        private String accountNum;
        private String fintechUseNum;
        private String rspCode;
        private String rspMessage;
        private boolean success;
    }
}
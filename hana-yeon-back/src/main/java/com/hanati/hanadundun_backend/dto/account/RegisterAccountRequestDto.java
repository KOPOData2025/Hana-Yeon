package com.hanati.hanadundun_backend.dto.account;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterAccountRequestDto {
    
    private List<AccountRegistrationDto> accountList;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountRegistrationDto {
        private String bankcode;
        private String bankName;
        private String productName;
        private String productSubName;
        private String accountType;
        private String accountNum;
        private String accountSeq;
        private String accountIssueDate;
        private String lastTranDate;
        private String dormancyYn;
        private BigDecimal returnRate;
        private Integer riskLevel;
    }
}
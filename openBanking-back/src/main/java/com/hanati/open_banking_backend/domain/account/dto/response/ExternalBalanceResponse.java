package com.hanati.open_banking_backend.domain.account.dto.response;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExternalBalanceResponse {
    private boolean success;
    private String message;
    private ExternalBalanceData data;

    @Getter
    @NoArgsConstructor
    public static class ExternalBalanceData {
        private String bankName;
        private String accountNum;
        private String balanceAmt;
        private String availableAmt;
        private String accountType;
        private String productName;
        private String accountIssueDate;
        private String maturityDate;
        private String lastTranDate;
        private BigDecimal returnRate;
        private Integer riskLevel;
    }
} 
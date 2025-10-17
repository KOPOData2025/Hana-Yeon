package com.hanati.open_banking_backend.domain.account.dto.response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ExternalAccountDetailResponse {
    private boolean success;
    private String message;
    private DetailData data;

    @Data
    public static class DetailData {
        private String bankName;
        private String savingsBankName;
        private String accountNum;
        private String accountSeq;
        private String accountType;
        private String scope;
        private String accountNumMasked;
        private String payerNum;
        private String inquiryAgreeYn;
        private String transferAgreeYn;
        private String userEmail;
        private BigDecimal returnRate;
        private Integer riskLevel;
    }
} 
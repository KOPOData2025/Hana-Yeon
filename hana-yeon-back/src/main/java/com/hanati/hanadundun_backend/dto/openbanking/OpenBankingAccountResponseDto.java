package com.hanati.hanadundun_backend.dto.openbanking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenBankingAccountResponseDto {
    
    private int status;
    private boolean success;
    private String message;
    private AccountData data;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountData {
        private List<AccountInfo> accounts;
        private int totalCount;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountInfo {
        private int listNum;
        private String bankCodeStd;
        private String activityType;
        private String accountType;
        private String accountNum;
        private String accountNumMasked;
        private String accountSeq;
        private String accountLocalCode;
        private String accountIssueDate;
        private String maturityDate;
        private String lastTranDate;
        private String productName;
        private String productSubName;
        private String dormancyYn;
        private Long balanceAmt;
        private Long depositAmt;
        private String balanceCalcBasis1;
        private String balanceCalcBasis2;
        private String investmentLinkedYn;
        private String bankLinkedYn;
        private String balanceAfterCancelYn;
        private String savingsBankCode;
    }
}
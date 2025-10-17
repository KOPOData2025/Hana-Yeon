package com.hanati.hanadundun_backend.dto.account;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountTransactionResponseDto {
    
    private String bankName;
    private String accountNum;
    private String balanceAmt;
    private String productName;
    private Integer pageRecordCnt;
    private String nextPageYn;
    private String beforInquiryTraceInfo;
    private List<TransactionDto> resList;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionDto {
        private String tranDate;
        private String tranTime;
        private String inoutType;
        private String tranType;
        private String printContent;
        private String tranAmt;
        private String afterBalanceAmt;
        private String branchName;
    }
}
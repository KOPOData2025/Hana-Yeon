package com.hanati.hanadundun_backend.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssetIntegrationResponseDto {
    
    private int totalLength;
    private int accountCount;
    private int insuranceCount;
    private List<AccountInfo> accountList;
    private List<InsuranceInfo> insuranceList;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountInfo {
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
    }
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InsuranceInfo {
        private String insuNum;
        private String productName;
        private String insuType;
        private String insuranceCompany;
        private String bankCodeStd;
    }
}
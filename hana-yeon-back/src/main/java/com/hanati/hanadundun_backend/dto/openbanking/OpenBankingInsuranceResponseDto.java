package com.hanati.hanadundun_backend.dto.openbanking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenBankingInsuranceResponseDto {
    
    private int status;
    private boolean success;
    private String message;
    private InsuranceData data;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InsuranceData {
        private int insuCnt;
        private List<InsuranceInfo> insuList;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InsuranceInfo {
        private String insuNum;
        private String prodName;
        private String insuType;
        private String insuranceCompany;
        private String insuStatus;
        private String issueDate;
        private String expDate;
    }
}
package com.hanati.open_banking_backend.domain.account.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ExternalInsuranceResponse {
    
    private int status;
    private boolean success;
    private String message;
    private int insuCnt;
    private List<Insurance> data;
    
    @Getter
    @NoArgsConstructor
    public static class Insurance {
        
        private String insuNum;
        private String prodName;
        private String insuType;
        private String insuranceCompany;
        private String insuStatus;
        private String issueDate;
        private String expDate;
        private Long insuAmt;
        private String bankCodeStd;
    }
} 
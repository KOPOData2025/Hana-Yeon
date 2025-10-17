package com.hanati.db_life_backend.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractResponse {
    
    private String insuNum;
    private String productName;
    private String insuType;
    private String insuStatus;
    private String bankCode;
    private String insuranceCompany;
    private String issueDate;
    private String expDate;
    private Integer monthlyPremium;
} 
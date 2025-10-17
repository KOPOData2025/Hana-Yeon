package com.hanati.hanadundun_backend.dto.insurance;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceDto {
    
    private String institutionCode;
    private String insuNum;
    private String prodName;
    private String insuType;
    private String insuranceCompany;
    private String insuStatus;
    private String issueDate;
    private String expDate;
    private Integer monthlyPremium;
}
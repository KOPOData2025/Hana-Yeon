package com.hanati.hanadundun_backend.dto.insurance;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterInsuranceRequestDto {
    
    private List<InsuranceRegistrationDto> insuranceList;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsuranceRegistrationDto {
        private String bankCodeStd;
        private String insuNum;
        private String productName;
        private String insuType;
        private String insuranceCompany;
    }
}
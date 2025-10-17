package com.hanati.hanadundun_backend.dto.insurance;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterInsuranceResponseDto {
    
    private List<InsuranceRegistrationResultDto> results;
    private Integer successCount;
    private Integer failureCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InsuranceRegistrationResultDto {
        private String bankCodeStd;
        private String insuNum;
        private String productName;
        private String insuType;
        private String insuranceCompany;
        private String rspCode;
        private String rspMessage;
        private boolean success;
    }
}
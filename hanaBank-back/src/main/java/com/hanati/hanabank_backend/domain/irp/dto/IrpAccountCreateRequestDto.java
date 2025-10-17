package com.hanati.hanabank_backend.domain.irp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IrpAccountCreateRequestDto {
    
    private String userCI;
    private String userName;
    private String productName;
    private String productSubName;
    private String irpType;
    private String irpProductName;
    private BigDecimal yieldRate;
    private LocalDate maturityDate;
} 
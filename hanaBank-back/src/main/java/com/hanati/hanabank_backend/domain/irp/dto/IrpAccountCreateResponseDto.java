package com.hanati.hanabank_backend.domain.irp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IrpAccountCreateResponseDto {
    
    private String accountNum;
    private String maskedAccountNum;
    private String bankCodeStd;
    private String accountType;
    private String irpType;
    private String irpProductName;
    private LocalDate maturityDate;
    private BigDecimal balanceAmt;
    private LocalDateTime createAt;
} 
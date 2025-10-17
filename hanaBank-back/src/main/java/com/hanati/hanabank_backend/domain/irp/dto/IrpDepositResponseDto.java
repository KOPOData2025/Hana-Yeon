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
public class IrpDepositResponseDto {
    
    private String wdAccountNum;
    private String rsvAccountNum;
    private String maskedAccountNum;
    private String rsvBankCodeStd;
    private String accountType;
    private String irpType;
    private String irpProductName;
    private LocalDate maturityDate;
    private BigDecimal depositAmt;
    private BigDecimal balanceAmt;
    private String paymentPrd;
    private LocalDateTime updatedAt;
} 
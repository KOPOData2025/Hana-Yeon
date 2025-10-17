package com.hanati.hanabank_backend.domain.irp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IrpDepositRequestDto {
    
    private String userCI;
    private String tranDtime;
    private String bankTranId;
    private String rsvBankCodeStd;
    private String wdAccountNum;
    private String rsvAccountNum;
    private BigDecimal depositAmt;
    private String reqClientName;
} 
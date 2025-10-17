package com.hanati.hanabank_backend.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawResponse {
    
    private String bankTranId;
    
    private String dpsPrintContent;
    
    private String accountNum;
    
    private String accountAlias;
    
    private String bankCodeStd;
    
    private String bankCodeSub;
    
    private String bankName;
    
    private String accountNumMasked;
    
    private String printContent;
    
    private String accountHolderName;
    
    private BigDecimal tranAmt;
    
    private BigDecimal wdLimitRemainAmt;
} 
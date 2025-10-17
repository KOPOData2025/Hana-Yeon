package com.hanati.shinhan_bank_backend.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawRequest {
    
    private String bankTranId;
    
    private String dpsPrintContent;
    
    private String wdBankCodeStd;
    
    private String wdAccountNum;
    
    private BigDecimal tranAmt;
    
    private String userCI;
    
    private String tranDtime;
    
    private String reqClientName;
} 
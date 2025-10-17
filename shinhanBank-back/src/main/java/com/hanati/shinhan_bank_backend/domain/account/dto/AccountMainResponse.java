package com.hanati.shinhan_bank_backend.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountMainResponse {
    
    private String accountNum;
    
    private String accountNumMasked;
    
    private String productName;
    
    private BigDecimal balanceAmt;
    
    private String bankCodeStd;
    
    private String accountType;
    
    private String lastTranDate;
    
    private Boolean isMainAccount;
} 
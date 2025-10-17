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
public class DepositResponse {
    
    private String tranNo;
    
    private String bankTranId;
    
    private String bankTranDate;
    
    private String bankCodeTran;
    
    private String bankRspCode;
    
    private String bankRspMessage;
    
    private String bankName;
    
    private String accountNum;
    
    private String accountNumMasked;
    
    private String printContent;
    
    private String accountHolderName;
    
    private BigDecimal tranAmt;
    
    private String withdrawBankTranId;
} 
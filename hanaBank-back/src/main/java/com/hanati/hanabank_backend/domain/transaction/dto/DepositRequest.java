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
public class DepositRequest {
    
    private String tranDtime;
    
    private String tranNo;
    
    private String bankTranId; 
    
    private String bankCodeStd; 
    
    private String accountNum; 
    
    private String accountHolderName; 
    
    private String printContent; 
    
    private BigDecimal tranAmt; 
    
    private String reqClientNum; 
    
    private String transferPurpose;
} 
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
public class AccountResponse {
    
    private Integer listNum;
    
    private String bankCodeStd;
    
    private String activityType;
    
    private String accountType;
    
    private String accountNum;
    
    private String accountNumMasked;
    
    private String accountSeq;
    
    private String accountLocalCode;
    
    private String accountIssueDate;
    
    private String maturityDate;
    
    private String lastTranDate;
    
    private String productName;
    
    private String productSubName;
    
    private String dormancyYn;
    
    private BigDecimal balanceAmt;
    
    private BigDecimal depositAmt;
    
    private String balanceCalcBasis1;
    
    private String balanceCalcBasis2;
    
    private String investmentLinkedYn;
    
    private String bankLinkedYn;
    
    private String balanceAfterCancelYn;
    
    private String savingsBankCode;
    
    private BigDecimal returnRate;
    
    private Integer riskLevel;
} 
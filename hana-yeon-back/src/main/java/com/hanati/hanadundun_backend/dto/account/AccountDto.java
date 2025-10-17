package com.hanati.hanadundun_backend.dto.account;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    
    private String fintechUseNum;
    private String bankCodeStd;
    private String bankName;
    private String accountNum;
    private String accountType;
    private String accountTypeName;
    private String accountAlias;
    private String accountHolderName;
    private Boolean isMainAccount;
    private String accountState;
    private String productName;
    private String balanceAmt;
    private String accountIssueDate;
    private Double returnRate;
    private Integer riskLevel;
}
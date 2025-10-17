package com.hanati.hanabank_backend.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccountResponse {
    private String accountNum;
    private String bankCodeStd;
    private String productName;
    private String accountType;
    private String accountIssueDate;
    private Double returnRate;
    private Integer riskLevel;
}
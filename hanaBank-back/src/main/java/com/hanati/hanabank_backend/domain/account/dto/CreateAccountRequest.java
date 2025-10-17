package com.hanati.hanabank_backend.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {
    private String userCi;
    private String productName;
    private String accountType;
    private Double returnRate;
    private Integer riskLevel;
}
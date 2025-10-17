package com.hanati.hanadundun_backend.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePensionAccountRequestDto {
    private String productName;
    private String accountType;
    private Double returnRate;
    private Integer riskLevel;
}
package com.hanati.hanadundun_backend.dto.account;

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
public class CreatePensionAccountResponseDto {
    private String accountNum;
    private String bankCodeStd;
    private String bankName;
    private String productName;
    private String accountType;
    private String accountIssueDate;
}
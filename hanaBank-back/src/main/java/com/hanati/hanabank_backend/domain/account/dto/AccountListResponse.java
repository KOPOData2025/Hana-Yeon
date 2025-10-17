package com.hanati.hanabank_backend.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountListResponse {
    
    private List<AccountResponse> accounts;
    
    private int totalCount;
} 
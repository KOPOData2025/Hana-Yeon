package com.hanati.db_life_backend.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractSearchRequest {
    
    private String userCi;
} 
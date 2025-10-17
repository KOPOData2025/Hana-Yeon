package com.hanati.db_life_backend.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractListResponse {
    
    private int status;
    private boolean success;
    private String message;
    private int insuCnt;
    private List<ContractResponse> data;
} 
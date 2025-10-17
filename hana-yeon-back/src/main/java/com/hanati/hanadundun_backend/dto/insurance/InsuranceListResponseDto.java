package com.hanati.hanadundun_backend.dto.insurance;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceListResponseDto {
    
    private List<InsuranceDto> insuList;
}
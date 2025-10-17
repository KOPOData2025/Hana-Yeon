package com.hanati.hanadundun_backend.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateInvestTypeResponseDto {
    private String investType;
    private String message;
}
package com.hanati.hanadundun_backend.dto.asset.analysis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomSolution {
    private String title;
    private String description;
}
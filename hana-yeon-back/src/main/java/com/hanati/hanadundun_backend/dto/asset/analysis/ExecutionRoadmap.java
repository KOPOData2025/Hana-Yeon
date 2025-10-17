package com.hanati.hanadundun_backend.dto.asset.analysis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionRoadmap {
    private List<String> immediate;
    private List<String> threeMonths;
    private List<String> longTerm;
}
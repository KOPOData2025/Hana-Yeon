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
public class PortfolioAnalysis {
    private String title;
    private String summary;
    private List<String> improvementPoints;
    private List<CustomSolution> customSolutions;
    private ExecutionRoadmap executionRoadmap;
}
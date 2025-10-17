package com.hanati.hanadundun_backend.dto.pension;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

// 연금 벤치마크 API 응답
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PensionBenchmarkResponseDto {
    
    // 대상 연령 그룹 (예: "65~69세")
    private String targetAgeGroup;
    
    // 평균 총 연금액
    private Long averageTotalPension;
    
    // 국민연금
    private Long nationalPension;
    
    // 퇴직연금
    private Long retirementPension;
    
    // 개인연금
    private Long personalPension;
    
    // 데이터 기준 연도
    private String dataYear;
}
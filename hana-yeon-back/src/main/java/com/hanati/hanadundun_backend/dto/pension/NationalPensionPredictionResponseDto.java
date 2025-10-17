package com.hanati.hanadundun_backend.dto.pension;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Map;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NationalPensionPredictionResponseDto {
    
    // 사용자가 납부한 월 보험료
    private Long monthlyContribution;
    
    // 가입 기간별 예상 연금액
    // Key: 가입 기간(년), Value: 월 예상 연금액
    private Map<String, Long> pensionAmountsByPeriod;
    
    // 전체 가입자 평균 소득월액
    private Long nationalAverageIncome;
    
    // 개인 기준소득월액 상한선
    private Long personalIncomeCap;
}
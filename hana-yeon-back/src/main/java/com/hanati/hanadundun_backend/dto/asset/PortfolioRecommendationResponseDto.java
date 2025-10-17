package com.hanati.hanadundun_backend.dto.asset;

import com.hanati.hanadundun_backend.dto.asset.analysis.PortfolioAnalysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioRecommendationResponseDto {

    // 포트폴리오 분석 결과
    private PortfolioAnalysis portfolioAnalysis;
    
    // 추천 상품 타입 목록 (isa, irp, personalPension, stock, insuranceCar, insuranceTeeth 등)
    private List<String> recommendations;
    
    // 현재 자산 요약 정보
    private Map<String, Object> assetSummary;
    
    // 사용자 자산 요약 정보를 담는 내부 클래스
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserAssetSummary {
        private int totalAssetCount;
        private int accountCount;
        private int insuranceCount;
        private int pensionCount;
        
        private int isaCount;
        private int irpCount;
        private int personalPensionCount;
        private List<String> insuranceTypes;
        
        private List<AssetCategoryInfo> categoryBreakdown;
        private List<BankInfo> bankBreakdown;
    }
    
    // 자산 카테고리별 정보
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssetCategoryInfo {
        private String categoryName;
        private String assetType;
        private int count;
        private List<String> productNames;
    }
    
    // 은행별 자산 정보
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BankInfo {
        private String bankName;
        private String bankCode;
        private int accountCount;
        private List<String> productTypes;
    }
}
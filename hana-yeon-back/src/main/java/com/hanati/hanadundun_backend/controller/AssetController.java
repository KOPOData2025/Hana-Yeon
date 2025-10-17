package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.asset.AssetIntegrationResponseDto;
import com.hanati.hanadundun_backend.dto.asset.PortfolioRecommendationResponseDto;
import com.hanati.hanadundun_backend.service.AssetService;
import com.hanati.hanadundun_backend.service.AIService;
import com.hanati.hanadundun_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import com.hanati.hanadundun_backend.entity.User;

@RestController
@RequestMapping("/api/asset")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AssetController {
    
    private final AssetService assetService;
    private final AIService aiService;
    private final UserService userService;
    
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @GetMapping("/searchAll")
    @Operation(summary = "보유 금융자산 조회")
    public ApiResponseDto<AssetIntegrationResponseDto> getAssetIntegrationInfo() {

        try {
            log.info("기존 자산 조회 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            AssetIntegrationResponseDto response = assetService.getIntegratedAssets(userId);

            return ApiResponseDto.success("자산 조회 완료", response);

        } catch (RuntimeException e) {
            log.error("자산 조회 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("자산 조회 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }
    
    @GetMapping("/portfolio")
    @Operation(summary = "AI 자산 포트폴리오 분석 및 추천")
    public ApiResponseDto<PortfolioRecommendationResponseDto> getPortfolioRecommendation() {
        
        try {
            log.info("포트폴리오 분석 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("포트폴리오 분석 대상 사용자: {}", user.getUserName());
            
            PortfolioRecommendationResponseDto response = aiService.generatePortfolioRecommendation(userId);
            
            return ApiResponseDto.success("포트폴리오 분석 완료", response);
            
        } catch (RuntimeException e) {
            log.error("포트폴리오 분석 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("포트폴리오 분석 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }
}
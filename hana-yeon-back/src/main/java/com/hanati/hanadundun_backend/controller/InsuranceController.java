package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.insurance.*;
import com.hanati.hanadundun_backend.dto.insurance.InsuranceListResponseDto;
import com.hanati.hanadundun_backend.dto.insurance.RegisterInsuranceRequestDto;
import com.hanati.hanadundun_backend.dto.insurance.RegisterInsuranceResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.InsuranceService;
import com.hanati.hanadundun_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InsuranceController {
    
    private final InsuranceService insuranceService;
    private final UserService userService;
   
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @PostMapping("/register")
    @Operation(summary = "다중 보험 등록")
    public ApiResponseDto<RegisterInsuranceResponseDto> registerInsurances(
            @RequestBody RegisterInsuranceRequestDto requestDto) {
        
        try {
            log.info("다중 보험 등록 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            RegisterInsuranceResponseDto response = insuranceService.registerInsurances(user.getUserCi(), requestDto);
            
            return ApiResponseDto.success("등록이 완료됐어요.", response);
            
        } catch (RuntimeException e) {
            log.error("보험 등록 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("보험 등록 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @GetMapping("/all")
    @Operation(summary = "전체 보험 조회")
    public ApiResponseDto<InsuranceListResponseDto> getAllInsurances() {
        
        try {
            log.info("전체 보험 조회 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            InsuranceListResponseDto insurances = insuranceService.getAllInsurances(user.getUserCi());
            
            return ApiResponseDto.success("보험 목록 조회가 성공적으로 완료되었습니다.", insurances);
            
        } catch (RuntimeException e) {
            log.error("보험 조회 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("보험 조회 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

}
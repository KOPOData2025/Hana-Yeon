package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.stock.UpdateInvestTypeRequestDto;
import com.hanati.hanadundun_backend.dto.stock.UpdateInvestTypeResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StockController {
    
    private final UserService userService;
   
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @PostMapping("/invest-type")
    @Operation(summary = "사용자 투자성향 업데이트")
    public ResponseEntity<ApiResponseDto<UpdateInvestTypeResponseDto>> updateInvestType(
            @RequestBody UpdateInvestTypeRequestDto request) {
        
        try {
            log.info("투자성향 업데이트 요청: {}", request.getInvestType());
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("투자성향 업데이트 대상 사용자: {}", user.getUserName());
            
            userService.updateInvestType(user.getUserId(), request.getInvestType());
            
            UpdateInvestTypeResponseDto response = new UpdateInvestTypeResponseDto(
                request.getInvestType(),
                "투자성향이 성공적으로 업데이트되었습니다."
            );
            
            return ResponseEntity.ok(
                ApiResponseDto.success("투자성향 업데이트 완료", response)
            );
            
        } catch (ResponseStatusException e) {
            log.error("투자성향 업데이트 실패 (인증 오류): {}", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(
                ApiResponseDto.error(e.getReason())
            );
        } catch (RuntimeException e) {
            log.error("투자성향 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("투자성향 업데이트 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                ApiResponseDto.error("서버 내부 오류가 발생했습니다.")
            );
        }
    }
}
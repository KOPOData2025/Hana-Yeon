package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.shop.BuyRequestDto;
import com.hanati.hanadundun_backend.service.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@Slf4j
public class ShopController {

    private final ShopService shopService;
    
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @PostMapping("/buy")
    public ResponseEntity<ApiResponseDto<Void>> buyProduct(
            @RequestBody BuyRequestDto request) {
        try {
            String userId = getAuthenticatedUserId();
            shopService.buyProduct(Long.parseLong(userId), request.getPoint());
            return ResponseEntity.ok(ApiResponseDto.success("상품 구매가 완료되었습니다.", null));
        } catch (RuntimeException e) {
            log.error("상품 구매 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.error(e.getMessage())
            );
        }
    }
}
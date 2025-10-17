package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.voc.VocRequestDto;
import com.hanati.hanadundun_backend.service.VocService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voc")
@RequiredArgsConstructor
public class VocController {

    private final VocService vocService;
    
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Void>> createVoc(@RequestBody VocRequestDto vocRequestDto) {
        String userId = getAuthenticatedUserId();

        vocService.createVoc(Long.parseLong(userId), vocRequestDto);
        return ResponseEntity.ok(
                ApiResponseDto.success("고객의 소리가 성공적으로 접수되었습니다.", null)
        );
    }
}
package com.hanati.hanadundun_backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthAccessTokenManager {

    private final AuthAccessTokenService authAccessTokenService;

    public String getAuthAccessToken() {
        try {
            log.info("OpenBanking API 토큰 요청 시작");
            String token = authAccessTokenService.ensureValidToken();
            log.info("OpenBanking API 토큰 확보 완료");
            return "Bearer " + token;
        } catch (Exception e) {
            log.error("OpenBanking API 토큰 확보 실패", e);
            throw new RuntimeException("OpenBanking API 토큰 확보 중 오류 발생", e);
        }
    }

    public String forceRefreshAuthAccessToken() {
        try {
            log.info("OpenBanking API 토큰 강제 갱신 시작");
            authAccessTokenService.revokeToken();
            String newToken = authAccessTokenService.ensureValidToken();
            log.info("OpenBanking API 토큰 강제 갱신 완료");
            return "Bearer " + newToken;
        } catch (Exception e) {
            log.error("OpenBanking API 토큰 강제 갱신 실패", e);
            throw new RuntimeException("OpenBanking API 토큰 강제 갱신 중 오류 발생", e);
        }
    }
}
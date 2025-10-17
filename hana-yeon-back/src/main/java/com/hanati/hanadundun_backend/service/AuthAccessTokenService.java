package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.client.AuthAccessTokenApiClient;
import com.hanati.hanadundun_backend.dto.AuthAccessTokenResponse;
import com.hanati.hanadundun_backend.entity.AuthAccessToken;
import com.hanati.hanadundun_backend.repository.AuthAccessTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthAccessTokenService {

    private final AuthAccessTokenRepository authAccessTokenRepository;
    private final AuthAccessTokenApiClient authAccessTokenApiClient;

    @Transactional
    public String ensureValidToken() {
        try {
            log.info("OpenBanking API 토큰 확보 시작");

            Optional<AuthAccessToken> existingTokenOpt = authAccessTokenRepository
                    .findTopByOrderByAuthAccessTokenIdDesc();

            if (existingTokenOpt.isPresent()) {
                AuthAccessToken token = existingTokenOpt.get();
                Instant expirationTime = token.getCreatedAt().plusSeconds(token.getExpiresIn() - 60);

                if (Instant.now().isBefore(expirationTime)) {
                    log.info("기존 유효한 토큰 사용: tokenId={}", token.getAuthAccessTokenId());
                    return token.getAuthAccessToken();
                } else {
                    log.info("기존 토큰 만료됨 (tokenId={}), 새로 발급", token.getAuthAccessTokenId());
                }
            }

            log.info("기존 토큰이 없거나 만료됨, 새로 발급");
            return issueNewToken();

        } catch (Exception e) {
            log.error("토큰 확보 중 오류", e);
            throw new RuntimeException("토큰 처리 중 오류 발생", e);
        }
    }

    @Transactional
    public String issueNewToken() {
        try {
            log.info("새로운 토큰 발급 시작");

            long deletedCount = authAccessTokenRepository.count();
            if (deletedCount > 0) {
                authAccessTokenRepository.deleteAll();
                log.info("기존 토큰 {}개 삭제 완료", deletedCount);
            }

            AuthAccessTokenResponse response = authAccessTokenApiClient.issueAuthToken();

            AuthAccessToken authAccessToken = new AuthAccessToken();
            authAccessToken.setAuthAccessToken(response.getAuthAccessToken());
            authAccessToken.setTokenType(response.getTokenType());
            authAccessToken.setExpiresIn(response.getExpiresIn());
            authAccessToken.setScope(response.getScope());
            authAccessToken.setClientUseCode(response.getClientUseCode());

            AuthAccessToken savedToken = authAccessTokenRepository.save(authAccessToken);

            log.info("새로운 토큰 저장 완료: tokenId={}, expiresIn={}",
                    savedToken.getAuthAccessTokenId(), savedToken.getExpiresIn());

            return savedToken.getAuthAccessToken();

        } catch (Exception e) {
            log.error("새로운 토큰 발급 중 오류", e);
            throw new RuntimeException("새로운 토큰 발급 실패", e);
        }
    }

    @Transactional(readOnly = true)
    public Optional<AuthAccessToken> getCurrentToken() {
        try {
            return authAccessTokenRepository.findTopByOrderByAuthAccessTokenIdDesc();
        } catch (Exception e) {
            log.error("현재 토큰 조회 중 오류 발생: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    @Transactional
    public void revokeToken() {
        try {
            long count = authAccessTokenRepository.count();
            if (count > 0) {
                authAccessTokenRepository.deleteAll();
                log.info("모든 토큰 삭제 완료: {}개", count);
            } else {
                log.info("삭제할 토큰이 없음");
            }
        } catch (Exception e) {
            log.error("토큰 삭제 중 오류 발생", e);
            throw new RuntimeException("토큰 삭제 실패", e);
        }
    }
}
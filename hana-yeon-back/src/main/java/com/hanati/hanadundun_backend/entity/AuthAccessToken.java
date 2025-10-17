package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * OpenBanking API 인증 토큰 엔티티
 * - 하나연(緣) 앱의 JWT 토큰과 별개
 * - OpenBanking API 호출 시에만 사용되는 2-legged OAuth 토큰
 */
@Entity
@Table(name = "auth_access_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthAccessToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auth_access_token_id")
    private Long authAccessTokenId;

    @Column(name = "auth_access_token", nullable = false, length = 500)
    private String authAccessToken;

    @Column(name = "token_type", length = 50)
    private String tokenType;

    @Column(name = "expires_in")
    private Long expiresIn;

    @Column(name = "scope", length = 100)
    private String scope;

    @Column(name = "client_use_code", length = 10)
    private String clientUseCode;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public boolean isValid() {
        return authAccessToken != null && !authAccessToken.trim().isEmpty();
    }

    public long getRemainingSeconds() {
        if (expiresIn == null || createdAt == null) {
            return -1;
        }

        Instant expiryTime = createdAt.plusSeconds(expiresIn);
        long remainingSeconds = expiryTime.getEpochSecond() - Instant.now().getEpochSecond();
        return Math.max(0, remainingSeconds);
    }
}
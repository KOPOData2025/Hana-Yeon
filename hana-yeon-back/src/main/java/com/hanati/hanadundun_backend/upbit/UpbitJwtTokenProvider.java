package com.hanati.hanadundun_backend.upbit;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class UpbitJwtTokenProvider {

    /**
     * 사용자별 API 키로 JWT 토큰 생성
     * @param accessKey 사용자의 Upbit Access Key
     * @param secretKey 사용자의 Upbit Secret Key
     * @return JWT 토큰
     */
    public String generateToken(String accessKey, String secretKey) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("access_key", accessKey);
        payload.put("nonce", UUID.randomUUID().toString());

        return Jwts.builder()
                .setClaims(payload)
                .signWith(SignatureAlgorithm.HS256,
                        secretKey.getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    /**
     * 쿼리 파라미터가 있는 요청을 위한 JWT 토큰 생성
     * @param accessKey 사용자의 Upbit Access Key
     * @param secretKey 사용자의 Upbit Secret Key
     * @param queryString 쿼리 스트링
     * @return JWT 토큰
     */
    public String generateTokenWithQuery(String accessKey, String secretKey, String queryString) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("access_key", accessKey);
        payload.put("nonce", UUID.randomUUID().toString());
        
        if (queryString != null && !queryString.isEmpty()) {
            payload.put("query_hash", queryString);
            payload.put("query_hash_alg", "SHA512");
        }

        return Jwts.builder()
                .setClaims(payload)
                .signWith(SignatureAlgorithm.HS256,
                        secretKey.getBytes(StandardCharsets.UTF_8))
                .compact();
    }
}
package com.hanati.hanadundun_backend.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanati.hanadundun_backend.dto.AuthAccessTokenResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class AuthAccessTokenApiClient {

    private static final String GRANT_TYPE = "client_credentials";
    private static final String SCOPE = "sa";

    @Value("${openbanking.base-url}")
    private String openBankingBaseUrl;

    @Value("${openbanking.client-id}")
    private String clientId;

    @Value("${openbanking.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AuthAccessTokenApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public AuthAccessTokenResponse issueAuthToken() {
        try {
            log.info("OpenBanking API 토큰 발급 요청 시작");
            
            String tokenUrl = openBankingBaseUrl + "/oauth/2.0/token";
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("clientId", clientId);
            requestBody.put("clientSecret", clientSecret);
            requestBody.put("scope", SCOPE);
            requestBody.put("grantType", GRANT_TYPE);

            log.debug("토큰 발급 요청 URL: {}", tokenUrl);
            log.debug("토큰 발급 요청 데이터: clientId={}, scope={}, grantType={}", 
                    clientId, SCOPE, GRANT_TYPE);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            org.springframework.http.HttpEntity<Map<String, String>> entity = 
                    new org.springframework.http.HttpEntity<>(requestBody, headers);

            String rawResponse = restTemplate.postForObject(tokenUrl, entity, String.class);
            
            log.debug("토큰 발급 원시 응답: {}", rawResponse);

            AuthAccessTokenResponse response = parseTokenResponse(rawResponse);
            
            validateTokenResponse(response);

            log.info("OpenBanking API 토큰 발급 완료: scope={}, expiresIn={}", 
                    response.getScope(), response.getExpiresIn());

            return response;

        } catch (Exception e) {
            log.error("OpenBanking API 토큰 발급 중 오류 발생", e);
            throw new RuntimeException("OpenBanking API 토큰 발급 실패", e);
        }
    }

    private AuthAccessTokenResponse parseTokenResponse(String rawResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(rawResponse);

            JsonNode successNode = rootNode.get("success");
            if (successNode == null || !successNode.asBoolean()) {
                String errorMessage = rootNode.has("message") ?
                        rootNode.get("message").asText() : "알 수 없는 오류";
                throw new RuntimeException("API 응답 실패: " + errorMessage);
            }

            JsonNode dataNode = rootNode.get("data");
            if (dataNode == null) {
                throw new RuntimeException("응답에 data 객체가 없습니다.");
            }

            log.debug("Data 노드 추출 성공: {}", dataNode.toString());

            AuthAccessTokenResponse response = objectMapper.treeToValue(dataNode, AuthAccessTokenResponse.class);

            log.debug("JSON 파싱 성공: {}", response);
            return response;

        } catch (Exception e) {
            log.error("JSON 파싱 실패: {}", e.getMessage());
            log.error("원시 응답: {}", rawResponse);
            throw new RuntimeException("응답 파싱 실패: " + e.getMessage(), e);
        }
    }

    private void validateTokenResponse(AuthAccessTokenResponse response) {
        if (response == null) {
            throw new RuntimeException("토큰 발급 응답이 null입니다.");
        }

        if (response.getAuthAccessToken() == null || response.getAuthAccessToken().trim().isEmpty()) {
            throw new RuntimeException("발급된 토큰이 비어있습니다.");
        }

        if (response.getExpiresIn() == null || response.getExpiresIn() <= 0) {
            log.warn("토큰 만료시간 정보가 올바르지 않습니다: expiresIn={}", response.getExpiresIn());
        }
    }
}
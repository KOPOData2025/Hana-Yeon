
package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.entity.UpbitUser;
import com.hanati.hanadundun_backend.repository.UpbitUserRepository;
import com.hanati.hanadundun_backend.upbit.UpbitJwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpbitApiService {

    private final UpbitJwtTokenProvider jwtTokenProvider;
    private final UpbitUserRepository upbitUserRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 사용자별 Upbit 계좌 정보 조회
     * @param userId 사용자 ID
     * @return Upbit 계좌 정보 JSON
     */
    public String getAccounts(Long userId) {
        UpbitUser upbitUser = getActiveUpbitUser(userId);
        
        String jwtToken = jwtTokenProvider.generateToken(upbitUser.getAccessKey(), upbitUser.getSecretKey());
        String url = "https://api.upbit.com/v1/accounts";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtToken);
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        return response.getBody();
    }

    /**
     * 사용자의 Upbit API 키 등록
     * @param userId 사용자 ID
     * @param accessKey Access Key
     * @param secretKey Secret Key
     * @return 등록된 UpbitUser 엔티티
     */
    public UpbitUser registerUpbitKeys(Long userId, String accessKey, String secretKey) {
        // 기존 등록된 키가 있다면 비활성화
        Optional<UpbitUser> existingUser = upbitUserRepository.findByUserId(userId);
        if (existingUser.isPresent()) {
            UpbitUser existing = existingUser.get();
            existing.setActive(false);
            upbitUserRepository.save(existing);
        }

        // 새로운 키 등록
        UpbitUser upbitUser = new UpbitUser();
        upbitUser.setUserId(userId);
        upbitUser.setAccessKey(accessKey);
        upbitUser.setSecretKey(secretKey);
        upbitUser.setActive(true);

        return upbitUserRepository.save(upbitUser);
    }

    /**
     * 사용자의 Upbit API 키 조회
     * @param userId 사용자 ID
     * @return UpbitUser 엔티티 (키 정보는 마스킹됨)
     */
    public UpbitUser getUpbitUser(Long userId) {
        UpbitUser upbitUser = getActiveUpbitUser(userId);
        
        // 보안을 위해 키 정보 마스킹
        UpbitUser maskedUser = new UpbitUser();
        maskedUser.setUserId(upbitUser.getUserId());
        maskedUser.setAccessKey(maskKey(upbitUser.getAccessKey()));
        maskedUser.setSecretKey(maskKey(upbitUser.getSecretKey()));
        maskedUser.setIsActive(upbitUser.getIsActive());
        maskedUser.setCreatedAt(upbitUser.getCreatedAt());
        maskedUser.setUpdatedAt(upbitUser.getUpdatedAt());
        
        return maskedUser;
    }

    /**
     * 사용자의 Upbit API 키 삭제 (비활성화)
     * @param userId 사용자 ID
     */
    public void deleteUpbitKeys(Long userId) {
        Optional<UpbitUser> upbitUser = upbitUserRepository.findByUserIdAndIsActive(userId, "Y");
        if (upbitUser.isPresent()) {
            UpbitUser user = upbitUser.get();
            user.setActive(false);
            upbitUserRepository.save(user);
        }
    }

    /**
     * 사용자의 활성 상태인 Upbit 정보 조회
     * @param userId 사용자 ID
     * @return UpbitUser 엔티티
     * @throws RuntimeException 등록된 키가 없는 경우
     */
    private UpbitUser getActiveUpbitUser(Long userId) {
        return upbitUserRepository.findByUserIdAndIsActive(userId, "Y")
                .orElseThrow(() -> new RuntimeException("등록된 Upbit API 키가 없습니다. 먼저 API 키를 등록해주세요."));
    }

    /**
     * API 키 마스킹 처리
     * @param key 원본 키
     * @return 마스킹된 키
     */
    private String maskKey(String key) {
        if (key == null || key.length() < 8) {
            return "****";
        }
        return key.substring(0, 4) + "****" + key.substring(key.length() - 4);
    }

    /**
     * 사용자의 Upbit API 키 등록 여부 확인
     * @param userId 사용자 ID
     * @return 등록 여부
     */
    public boolean hasUpbitKeys(Long userId) {
        return upbitUserRepository.existsByUserIdAndIsActive(userId, "Y");
    }
}
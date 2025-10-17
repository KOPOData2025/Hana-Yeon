package com.third_party_backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class CiHashing {
    @Value("${authentication.salt}")
    private String CI_SALT;

    // CI 값 생성 
    public String generateCiValue(String residentNumber) {
        try {
            // 주민번호에서 하이픈 제거
            String cleanResidentNumber = residentNumber.replace("-", "");
            
            // 솔트와 주민번호를 결합하여 해싱
            String dataToHash = CI_SALT + cleanResidentNumber;
            
            // SHA-256으로 해싱
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(dataToHash.getBytes(StandardCharsets.UTF_8));
            
            // 바이트 배열을 16진수 문자열로 변환
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            String ciValue = hexString.toString();
            log.info("CI 값 생성 완료 - 해시값 길이: {}", ciValue.length());
            
            return ciValue;
            
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 알고리즘을 찾을 수 없습니다.", e);
            throw new RuntimeException("해싱 알고리즘 오류", e);
        } catch (Exception e) {
            log.error("CI 값 생성 중 오류 발생", e);
            throw new RuntimeException("CI 값 생성에 실패했습니다.", e);
        }
    }

    // 주민번호 유효성 검증 (단순 형식 검증만)
    public boolean validateResidentNumber(String residentNumber) {
        if (residentNumber == null) {
            log.warn("주민번호가 null입니다.");
            return false;
        }

        // 길이 체크 (하이픈 포함 14자리)
        if (residentNumber.length() != 14) {
            log.warn("주민번호 길이 오류: {} (길이: {})", residentNumber, residentNumber.length());
            return false;
        }

        // 기본 형식 검증 (YYMMDD-NNNNNNN)
        if (!residentNumber.matches("^\\d{6}-\\d{7}$")) {
            log.warn("주민번호 형식 오류: {}", residentNumber);
            return false;
        }

        log.debug("주민번호 형식 검증 통과: {}", maskResidentNumber(residentNumber));
        return true;
    }

    // 주민번호 마스킹 (로그용)
    private String maskResidentNumber(String residentNumber) {
        if (residentNumber == null || residentNumber.length() != 14) {
            return "******-*******";
        }
        return residentNumber.substring(0, 6) + "-*******";
    }


    // CI 마스킹
    public String maskCiValue(String ciValue) {
        if (ciValue == null || ciValue.length() < 8) {
            return "****";
        }
        
        // 앞 4자리 + 별표 + 뒤 4자리
        return ciValue.substring(0, 4) + "****" + ciValue.substring(ciValue.length() - 4);
    }
} 
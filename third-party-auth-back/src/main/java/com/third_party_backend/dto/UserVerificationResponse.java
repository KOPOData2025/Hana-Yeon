package com.third_party_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVerificationResponse {
    
    private boolean success;
    private String message;
    private String userCi;

    public static UserVerificationResponse success(String ciValue) {
        return new UserVerificationResponse(true, "인증이 성공적으로 완료되었습니다.", ciValue);
    }
    
    public static UserVerificationResponse failure(String message) {
        return new UserVerificationResponse(false, message, null);
    }

    public static UserVerificationResponse smsSent(String userPhone, String verificationCode) {
        // 숫자만 남기기 (하이픈 제거 포함)
        String digits = userPhone.replaceAll("[^\\d]", "");

        if (digits.length() == 11) {
            digits = digits.replaceAll("(\\d{3})(\\d{4})(\\d{4})", "$1****$3");
        } else if (digits.length() == 10) {
            digits = digits.replaceAll("(\\d{3})(\\d{3})(\\d{4})", "$1***$3");
        }

        return new UserVerificationResponse(
                true, digits + " 번호로 성공적으로 SMS 인증 코드가 발송되었습니다.", null
        );
    }
} 
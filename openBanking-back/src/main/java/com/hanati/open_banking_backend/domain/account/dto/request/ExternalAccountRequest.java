package com.hanati.open_banking_backend.domain.account.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExternalAccountRequest {
    
    private String userNum; // 사용자 주민등록번호 (999999-9999999 형식) - 호환성 유지
    private String userCi;  // 사용자 CI (Connecting Information)
} 
package com.hanati.open_banking_backend.domain.account.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExternalAccountDetailRequest {
    private String userCi;
    private String accountNum;
} 
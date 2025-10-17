package com.hanati.shinhan_bank_backend.domain.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryRequest {

    @NotBlank(message = "사용자 CI는 필수입니다.")
    @JsonProperty("userCi")
    private String userCi;

    @NotBlank(message = "계좌번호는 필수입니다.")
    @JsonProperty("accountNum")
    private String accountNum;

    @JsonProperty("inquiryType")
    private String inquiryType = "A"; // 기본값: A (모두), I (입금), O (출금)

    @JsonProperty("sortOrder")
    private String sortOrder = "D"; // 기본값: D (내림차순), A (오름차순)
} 
package com.hanati.open_banking_backend.domain.account.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "계좌 잔액 조회 요청")
public class BalanceRequest {
    @Schema(description = "거래고유번호", example = "BANKTRAN123456789012")
    private String bankTranId;

    @Schema(description = "은행 표준 코드", example = "081")
    private String bankCodeStd;

    @Schema(description = "계좌번호", example = "1234567890123456")
    private String accountNum;

    @Schema(description = "사용자 CI (고객확인정보)", example = "CI1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF")
    private String userCi;

    @Schema(description = "요청일시", example = "20250704123045")
    private String tranDtime;
} 
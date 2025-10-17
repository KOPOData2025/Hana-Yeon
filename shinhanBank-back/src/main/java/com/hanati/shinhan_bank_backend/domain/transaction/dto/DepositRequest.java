package com.hanati.shinhan_bank_backend.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositRequest {

    private String tranDtime;

    private String tranNo;

    // 출금 트랜잭션 부분
    private String bankTranId; // 출금이 발생한 트랜잭션

    private String bankCodeStd; // 출금은행 코드

    private String accountNum; // 출금 계좌

    private String accountHolderName; // 출금인

    private String printContent; // 출금 내역

    private BigDecimal tranAmt; // 금액

    // 하단부는 입금해야될 데이터 명시
    private String reqClientNum; // 입금

    private String transferPurpose;
}
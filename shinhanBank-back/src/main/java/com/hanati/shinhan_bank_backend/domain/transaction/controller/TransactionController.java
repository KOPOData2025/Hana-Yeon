package com.hanati.shinhan_bank_backend.domain.transaction.controller;

import com.hanati.shinhan_bank_backend.domain.transaction.dto.*;
import com.hanati.shinhan_bank_backend.domain.transaction.service.TransactionService;
import com.hanati.shinhan_bank_backend.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * 출금 API
     * POST /api/v1/transactions/withdraw
     */
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<WithdrawResponse>> withdraw(@RequestBody WithdrawRequest request) {
        log.info("출금 요청 - 계좌번호: {}, 금액: {}", request.getWdAccountNum(), request.getTranAmt());

        try {
            WithdrawResponse response = transactionService.processWithdraw(request);
            log.info("출금 성공 - 거래ID: {}", response.getBankTranId());
            return ResponseEntity.ok(ApiResponse.success(response));

        } catch (IllegalArgumentException e) {
            log.warn("출금 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));

        } catch (IllegalStateException e) {
            log.error("출금 실패 - 시스템 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("출금 처리 중 오류가 발생했습니다."));

        } catch (Exception e) {
            log.error("출금 처리 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("출금 처리 중 오류가 발생했습니다."));
        }
    }

    /**
     * 입금 API
     * POST /api/v1/transactions/deposit
     */
    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<DepositResponse>> deposit(@RequestBody DepositRequest request) {
        log.info("입금 요청 - 계좌번호: {}, 금액: {}",
                request.getReqClientNum(), request.getTranAmt());

        try {
            DepositResponse response = transactionService.processDeposit(request);
            log.info("입금 성공 - 거래ID: {}", response.getBankTranId());
            return ResponseEntity.ok(ApiResponse.success(response));

        } catch (IllegalArgumentException e) {
            log.warn("입금 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));

        } catch (IllegalStateException e) {
            log.error("입금 실패 - 시스템 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("입금 처리 중 오류가 발생했습니다."));

        } catch (Exception e) {
            log.error("입금 처리 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("입금 처리 중 오류가 발생했습니다."));
        }
    }

    // TransactionController.java에 추가할 메서드
    /**
     * 거래내역 조회 API
     * POST /api/v1/transactions/history
     */
    @PostMapping("/history")
    public ResponseEntity<ApiResponse<TransactionHistoryResponse>> getTransactionHistory(
            @Valid @RequestBody TransactionHistoryRequest request) {
        log.info("거래내역 조회 요청 - CI: {}, 계좌번호: {}, 조회타입: {}, 정렬: {}",
                request.getUserCi(), request.getAccountNum(), request.getInquiryType(), request.getSortOrder());

        try {
            TransactionHistoryResponse response = transactionService.getTransactionHistory(request);
            log.info("거래내역 조회 성공 - 거래건수: {}", response.getPageRecordCnt());
            return ResponseEntity.ok(ApiResponse.success(response));

        } catch (IllegalArgumentException e) {
            log.warn("거래내역 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));

        } catch (Exception e) {
            log.error("거래내역 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("거래내역 조회 중 오류가 발생했습니다."));
        }
    }
} 
package com.hanati.shinhan_bank_backend.domain.account.controller;

import com.hanati.shinhan_bank_backend.domain.account.dto.AccountBalanceRequest;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountBalanceResponse;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountDetailRequest;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountDetailResponse;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountListResponse;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountMainResponse;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountSearchRequest;
import com.hanati.shinhan_bank_backend.domain.account.dto.AccountSearchByUserNumRequest;
import com.hanati.shinhan_bank_backend.domain.account.service.AccountService;
import com.hanati.shinhan_bank_backend.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Slf4j
public class AccountController {
    
    private final AccountService accountService;
    

     // 사용자 CI로 계좌 목록 조회
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<AccountListResponse>> searchAccountsByUserCi(@RequestBody AccountSearchRequest request) {
        log.info("계좌 목록 조회 요청 (POST) - CI: {}", request.getUserCi());
        try {
            AccountListResponse response = accountService.searchAccountsByUserCi(request);
            log.info("계좌 목록 조회 성공 - 계좌 수: {}", response.getTotalCount());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("계좌 목록 조회 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("계좌 목록 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("계좌 목록 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 사용자 번호로 계좌 목록 조회
    @PostMapping("/search-by-user-num")
    public ResponseEntity<ApiResponse<AccountListResponse>> searchAccountsByUserNum(@Valid @RequestBody AccountSearchByUserNumRequest request) {
        log.info("계좌 목록 조회 요청 (POST) - UserNum: {}", request.getUserNum());
        try {
            AccountListResponse response = accountService.searchAccountsByUserNum(request);
            log.info("계좌 목록 조회 성공 - 계좌 수: {}", response.getTotalCount());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("계좌 목록 조회 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("계좌 목록 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("계좌 목록 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 사용자 CI로 주거래 계좌 조회
    @PostMapping("/main")
    public ResponseEntity<ApiResponse<AccountMainResponse>> searchMainAccountByUserCi(@RequestBody AccountSearchRequest request) {
        log.info("주거래 계좌 조회 요청 (POST) - CI: {}", request.getUserCi());
        try {
            AccountMainResponse response = accountService.searchMainAccountByUserCi(request);
            log.info("주거래 계좌 조회 성공 - 계좌번호: {}", response.getAccountNumMasked());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("주거래 계좌 조회 실패 - 존재하지 않는 사용자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("주거래 계좌 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("주거래 계좌 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 사용자 CI와 계좌번호로 계좌 상세 정보 조회
    @PostMapping("/detail")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> getAccountDetailByUserCi(@RequestBody AccountDetailRequest request) {
        log.info("계좌 상세 정보 조회 요청 - CI: {}, 계좌번호: {}", request.getUserCi(), request.getAccountNum());
        try {
            AccountDetailResponse response = accountService.getAccountDetailByUserCi(request);
            log.info("계좌 상세 정보 조회 성공 - 계좌번호: {}", response.getAccountNumMasked());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("계좌 상세 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("계좌 상세 정보 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("계좌 상세 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 사용자 CI와 계좌번호로 계좌 잔액 조회
    @PostMapping("/balance")
    public ResponseEntity<ApiResponse<AccountBalanceResponse>> getAccountBalance(@Valid @RequestBody AccountBalanceRequest request) {
        log.info("계좌 잔액 조회 요청 - CI: {}, 계좌번호: {}", request.getUserCi(), request.getAccountNum());
        try {
            AccountBalanceResponse response = accountService.getAccountBalance(request);
            log.info("계좌 잔액 조회 성공 - 계좌번호: {}, 잔액: {}", response.getAccountNum(), response.getBalanceAmt());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            log.warn("계좌 잔액 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("계좌 잔액 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("계좌 잔액 조회 중 오류가 발생했습니다."));
        }
    }
} 
package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.account.*;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.AccountService;
import com.hanati.hanadundun_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AccountController {
    
    private final AccountService accountService;
    private final UserService userService;
    
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @PostMapping("/register")
    @Operation(summary = "다중 계좌 등록")
    public ApiResponseDto<RegisterAccountResponseDto> registerAccounts(
            @RequestBody RegisterAccountRequestDto requestDto) {
        
        try {
            log.info("다중 계좌 등록 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            RegisterAccountResponseDto response = accountService.registerAccounts(user.getUserCi(), requestDto);
            
            return ApiResponseDto.success("등록이 완료됐어요.", response);
            
        } catch (RuntimeException e) {
            log.error("계좌 등록 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("계좌 등록 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @GetMapping("/all")
    @Operation(summary = "전체 계좌 조회")
    public ApiResponseDto<List<AccountDto>> getAllAccounts() {
        
        try {
            log.info("전체 계좌 조회 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            List<AccountDto> accounts = accountService.getAllAccounts(user.getUserCi());
            
            return ApiResponseDto.success("계좌 조회에 성공했어요.", accounts);
            
        } catch (RuntimeException e) {
            log.error("계좌 조회 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("계좌 조회 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @GetMapping("/transaction/{accountNum}")
    @Operation(summary = "계좌 상세 조회 (거래내역)")
    public ApiResponseDto<AccountTransactionResponseDto> getAccountTransactions(
            @PathVariable String accountNum) {
        
        try {
            log.info("계좌 상세 조회 요청 수신 - accountNum: {}", accountNum);
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            AccountTransactionResponseDto transactions = accountService.getAccountTransactions(user.getUserCi(), accountNum);
            
            return ApiResponseDto.success("거래내역조회가 성공적으로 완료되었습니다.", transactions);
            
        } catch (RuntimeException e) {
            log.error("거래내역 조회 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("거래내역 조회 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @PostMapping("/transfer")
    @Operation(summary = "계좌 이체")
    public ApiResponseDto<Void> transferMoney(
            @RequestBody TransferRequestDto requestDto) {
        
        try {
            log.info("계좌 이체 요청 수신 - amount: {}", requestDto.getTranAmt());
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            accountService.transferMoney(user.getUserCi(), requestDto);
            
            return ApiResponseDto.success("이체에 성공했어요.");
            
        } catch (RuntimeException e) {
            log.error("이체 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("이체 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @GetMapping("/all/retirement")
    @Operation(summary = "전체 연금 관련 계좌 조회")
    public ApiResponseDto<List<AccountDto>> getAllRetirementAccounts() {
        
        try {
            log.info("전체 연금 관련 계좌 조회 요청 수신");
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            List<AccountDto> allAccounts = accountService.getAllAccounts(user.getUserCi());
            List<AccountDto> pensionAccounts = allAccounts.stream()
                    .filter(account -> account.getAccountType() != null && 
                            account.getAccountType().toLowerCase().contains("pension"))
                    .toList();
            
            return ApiResponseDto.success("연금 계좌 조회에 성공했어요.", pensionAccounts);
            
        } catch (RuntimeException e) {
            log.error("계좌 조회 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("계좌 조회 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }

    @PostMapping("/create")
    @Operation(summary = "계좌 생성")
    public ApiResponseDto<CreatePensionAccountResponseDto> createAccount(
            @RequestBody CreatePensionAccountRequestDto requestDto) {
        
        try {
            log.info("계좌 생성 요청 수신 - productName: {}, accountType: {}", 
                    requestDto.getProductName(), requestDto.getAccountType());
            
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.parseLong(userId));
            
            log.info("인증된 사용자: {}", user.getUserName());
            
            CreatePensionAccountResponseDto response = accountService.createAccount(user.getUserCi(), user.getUserId(), requestDto);
            
            return ApiResponseDto.success("계좌가 생성되었어요.", response);
            
        } catch (RuntimeException e) {
            log.error("계좌 생성 실패: {}", e.getMessage());
            return ApiResponseDto.error(e.getMessage());
        } catch (Exception e) {
            log.error("계좌 생성 중 예상치 못한 오류 발생", e);
            return ApiResponseDto.error("서버 내부 오류가 발생했습니다.");
        }
    }
}
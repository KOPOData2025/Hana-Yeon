package com.hanati.hanabank_backend.domain.irp.service;

import com.hanati.hanabank_backend.domain.irp.dto.IrpAccountCreateRequestDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpAccountCreateResponseDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpDepositRequestDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpDepositResponseDto;
import com.hanati.hanabank_backend.domain.irp.entity.IrpAccount;
import com.hanati.hanabank_backend.domain.irp.entity.IrpInvestmentProduct;
import com.hanati.hanabank_backend.domain.irp.repository.IrpAccountRepository;
import com.hanati.hanabank_backend.domain.irp.repository.IrpInvestmentProductRepository;
import com.hanati.hanabank_backend.domain.account.entity.Account;
import com.hanati.hanabank_backend.domain.account.repository.AccountRepository;
import com.hanati.hanabank_backend.domain.user.entity.User;
import com.hanati.hanabank_backend.domain.user.repository.UserRepository;
import com.hanati.hanabank_backend.domain.transaction.entity.Transaction;
import com.hanati.hanabank_backend.domain.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IrpAccountService {
    
    private final IrpAccountRepository irpAccountRepository;
    private final IrpInvestmentProductRepository irpInvestmentProductRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    
    @Transactional
    public IrpAccountCreateResponseDto createIrpAccount(IrpAccountCreateRequestDto request) {
        
        log.info(">>> IRP 계좌 생성 서비스 시작");
        
        // 1. 사용자 조회
        User user = userRepository.findByUserCi(request.getUserCI())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + request.getUserCI()));
        
        log.info("1. 사용자 조회 완료 - userCi: {}, username: {}", request.getUserCI(), user.getUsername());
        
        // 2. 계좌번호 및 기타 ID 생성
        String accountNum = generateUniqueAccountNumber();
        String irpId = UUID.randomUUID().toString();
        String productId = UUID.randomUUID().toString();
        
        log.info("2. 고유 ID 생성 완료 - accountNum: {}, irpId: {}, productId: {}", 
                accountNum, irpId, productId);
        
        // 3. Account 엔티티 생성 및 저장
        String maskedAccountNum = maskAccountNumber(accountNum);
        
        log.info("3-1. 계좌번호 마스킹 완료 - original: {}, masked: {}", accountNum, maskedAccountNum);
        
        Account account = Account.builder()
                .accountNum(accountNum)
                .userId(user.getUserId())
                .bankCodeStd("081") // 하나은행 코드
                .activityType("A") // 활동계좌
                .accountType("IRP") // IRP 계좌
                .accountNumMasked(maskedAccountNum)
                .accountSeq("01")
                .accountLocalCode("0810001")
                .accountIssueDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .maturityDate(request.getMaturityDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .lastTranDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .productName(request.getProductName())
                .productSubName(request.getProductSubName())
                .dormancyYn("N")
                .balanceAmt(BigDecimal.ZERO)
                .depositAmt(BigDecimal.ZERO)
                .balanceCalcBasis1("1")
                .balanceCalcBasis2("1")
                .investmentLinkedYn("N")
                .bankLinkedYn("N")
                .balanceAfterCancelYn("N")
                .savingsBankCode("081")
                .build();

        log.info("3-2. Account 엔티티 생성 완료 - 저장 시도 중...");
        
        Account savedAccount = accountRepository.save(account);
        log.info("3-3. Account 엔티티 저장 완료 - accountId: {}, accountNum: {}", 
                savedAccount.getAccountId(), savedAccount.getAccountNum());
        
        // 4. IRP 계좌 생성 (savedAccount의 accountId를 사용)
        IrpAccount irpAccount = IrpAccount.builder()
                .irpId(irpId)
                .accountId(savedAccount.getAccountId().toString()) 
                .totalEvaluationAmount(BigDecimal.ZERO)
                .yieldRate(request.getYieldRate())
                .maturityDate(request.getMaturityDate())
                .withdrawalLimitYn("N")
                .irpType(request.getIrpType())
                .irpStatus("ACTIVE")
                .build();

        irpAccountRepository.save(irpAccount);
        log.info("4. IRP 계좌 저장 완료 - irpType: {}, yieldRate: {}, accountId: {}", 
                request.getIrpType(), request.getYieldRate(), savedAccount.getAccountId());
        
        // 5. IRP 투자상품 생성
        IrpInvestmentProduct irpInvestmentProduct = IrpInvestmentProduct.builder()
                .productId(productId)
                .irpId(irpId)
                .productName(request.getProductName())
                .bankCodeStd("081") // 하나은행 코드
                .investAmt(BigDecimal.ZERO)
                .expectedYield(request.getYieldRate())
                .actualYield(BigDecimal.ZERO)
                .startDate(LocalDate.now())
                .maturityDate(request.getMaturityDate())
                .build();

        irpInvestmentProductRepository.save(irpInvestmentProduct);
        log.info("5. IRP 투자상품 저장 완료 - productName: {}, bankCodeStd: 081",
                request.getProductName());
        
        // 6. 응답 DTO 생성
        IrpAccountCreateResponseDto response = IrpAccountCreateResponseDto.builder()
                .accountNum(accountNum)
                .maskedAccountNum(maskAccountNumber(accountNum))
                .bankCodeStd("081")
                .accountType("IRP")
                .irpType(request.getIrpType())
                .irpProductName(request.getIrpProductName())
                .maturityDate(request.getMaturityDate())
                .balanceAmt(BigDecimal.ZERO)
                .createAt(LocalDateTime.now())
                .build();
        
        log.info("6. 응답 DTO 생성 완료");
        log.info(">>> IRP 계좌 생성 서비스 종료 - 최종 계좌번호: {}, accountId: {}", 
                accountNum, savedAccount.getAccountId());
        
        return response;
    }
    
    @Transactional
    public IrpDepositResponseDto processIrpDeposit(IrpDepositRequestDto request) {
        log.info(">>> IRP 입금 처리 시작");
        
        // 1. 사용자 조회
        User user = userRepository.findByUserCi(request.getUserCI())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + request.getUserCI()));
        
        log.info("1. 사용자 조회 완료 - userCi: {}", request.getUserCI());
        
        // 2. 입금받을 계좌 조회 (rsvAccountNum)
        Account account = accountRepository.findByAccountNum(request.getRsvAccountNum())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계좌입니다: " + request.getRsvAccountNum()));
        
        log.info("2. 입금받을 계좌 조회 완료 - accountNum: {}, 현재 잔액: {}", 
                account.getAccountNum(), account.getBalanceAmt());
        
        // 3. IRP 계좌 정보 조회
        IrpAccount irpAccount = irpAccountRepository.findByAccountId(account.getAccountId().toString())
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("IRP 계좌 정보를 찾을 수 없습니다: " + account.getAccountId()));
        
        log.info("3. IRP 계좌 정보 조회 완료 - irpType: {}, irpId: {}", 
                irpAccount.getIrpType(), irpAccount.getIrpId());
        
        // 4. IRP 투자상품 정보 조회
        IrpInvestmentProduct irpProduct = irpInvestmentProductRepository.findByIrpId(irpAccount.getIrpId())
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("IRP 투자상품 정보를 찾을 수 없습니다: " + irpAccount.getIrpId()));
        
        log.info("4. IRP 투자상품 정보 조회 완료 - productName: {}", irpProduct.getProductName());
        
        // 5. 입금 금액 검증
        if (request.getDepositAmt() == null || request.getDepositAmt().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("입금 금액은 0원보다 커야 합니다.");
        }
        
        // 6. 잔액 업데이트
        BigDecimal newBalance = account.getBalanceAmt().add(request.getDepositAmt());
        int updatedRows = accountRepository.updateAccountBalance(account.getAccountId(), newBalance);
        
        if (updatedRows != 1) {
            throw new IllegalStateException("계좌 잔액 업데이트에 실패했습니다.");
        }
        
        log.info("5. 계좌 잔액 업데이트 완료 - 이전 잔액: {}, 입금액: {}, 새 잔액: {}", 
                account.getBalanceAmt(), request.getDepositAmt(), newBalance);
        
        // 7. 트랜잭션 로그 생성
        Transaction transaction = Transaction.builder()
                .tranId(request.getBankTranId())
                .accountId(account.getAccountId())
                .tranDate(LocalDate.now())
                .tranTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmmss")))
                .inoutType("입금")
                .tranType("IRP입금")
                .printContent("IRP계좌입금")
                .tranAmt(request.getDepositAmt())
                .afterBalanceAmt(newBalance)
                .branchName("하나은행")
                .wdBankCodeStd(request.getRsvBankCodeStd())
                .wdAccountNum(request.getWdAccountNum())
                .reqClientName(request.getReqClientName())
                .build();
        
        transactionRepository.save(transaction);
        log.info("6. 트랜잭션 로그 생성 완료 - tranId: {}", request.getBankTranId());
        
        // 8. 응답 DTO 생성
        IrpDepositResponseDto response = IrpDepositResponseDto.builder()
                .wdAccountNum(request.getWdAccountNum())
                .rsvAccountNum(request.getRsvAccountNum())
                .maskedAccountNum(account.getAccountNumMasked())
                .rsvBankCodeStd(request.getRsvBankCodeStd())
                .accountType("IRP")
                .irpType(irpAccount.getIrpType())
                .irpProductName(irpProduct.getProductName())
                .maturityDate(irpAccount.getMaturityDate())
                .depositAmt(request.getDepositAmt())
                .balanceAmt(newBalance)
                .paymentPrd(calculatePaymentPeriod(account.getAccountIssueDate(), irpAccount.getMaturityDate()))
                .updatedAt(LocalDateTime.now())
                .build();
        
        log.info("7. 응답 DTO 생성 완료");
        log.info(">>> IRP 입금 처리 완료 - 최종 잔액: {}", newBalance);
        
        return response;
    }
    
    private String calculatePaymentPeriod(String issueDate, LocalDate maturityDate) {
        // 납입기간 계산 (발행일부터 만기일까지)
        if (issueDate == null || maturityDate == null) {
            return "정보없음";
        }
        
        try {
            LocalDate issue = LocalDate.parse(issueDate, DateTimeFormatter.ofPattern("yyyyMMdd"));
            long months = java.time.temporal.ChronoUnit.MONTHS.between(issue, maturityDate);
            return months + "개월";
        } catch (Exception e) {
            log.warn("납입기간 계산 중 오류 발생: {}", e.getMessage());
            return "정보없음";
        }
    }
    
    private String generateUniqueAccountNumber() {
        long timestamp = System.currentTimeMillis();
        String timestampStr = String.valueOf(timestamp);
        
        String accountNum = "081" + timestampStr.substring(timestampStr.length() - 13);
        
        log.debug("계좌번호 생성: {} (timestamp: {})", accountNum, timestamp);
        return accountNum;
    }

    // 계좌번호 마스킹 (길이 제한 고려하여 20자리 이내)
    private String maskAccountNumber(String accountNum) {
        if (accountNum.length() < 5) {
            return accountNum;
        }
        
        String prefix = accountNum.substring(0, 3);
        String suffix = accountNum.substring(accountNum.length() - 2);
        
        int middleLength = Math.min(accountNum.length() - 5, 12); 
        String middle = "*".repeat(middleLength);
        
        String maskedNum = prefix + middle + suffix;
        log.debug("계좌번호 마스킹: {} -> {} (길이: {})", accountNum, maskedNum, maskedNum.length());
        return maskedNum;
    }
} 
package com.hanati.hanabank_backend.domain.account.service;

import com.hanati.hanabank_backend.domain.account.dto.AccountBalanceRequest;
import com.hanati.hanabank_backend.domain.account.dto.AccountBalanceResponse;
import com.hanati.hanabank_backend.domain.account.dto.AccountDetailRequest;
import com.hanati.hanabank_backend.domain.account.dto.AccountDetailResponse;
import com.hanati.hanabank_backend.domain.account.dto.AccountListResponse;
import com.hanati.hanabank_backend.domain.account.dto.AccountMainResponse;
import com.hanati.hanabank_backend.domain.account.dto.AccountResponse;
import com.hanati.hanabank_backend.domain.account.dto.AccountSearchRequest;
import com.hanati.hanabank_backend.domain.account.dto.AccountSearchByUserNumRequest;
import com.hanati.hanabank_backend.domain.account.dto.CreateAccountRequest;
import com.hanati.hanabank_backend.domain.account.dto.CreateAccountResponse;
import com.hanati.hanabank_backend.domain.account.entity.Account;
import com.hanati.hanabank_backend.domain.account.repository.AccountRepository;
import com.hanati.hanabank_backend.domain.user.entity.User;
import com.hanati.hanabank_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    public AccountListResponse getAccountsByUserCi(String userCi) {
        User user = userRepository.findByUserCi(userCi)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        List<Account> accounts = accountRepository.findByUserId(user.getUserId());
        
        List<AccountResponse> accountResponses = accounts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        for (int i = 0; i < accountResponses.size(); i++) {
            AccountResponse response = accountResponses.get(i);
            accountResponses.set(i, AccountResponse.builder()
                    .listNum(i + 1)
                    .bankCodeStd(response.getBankCodeStd())
                    .activityType(response.getActivityType())
                    .accountType(response.getAccountType())
                    .accountNum(response.getAccountNum())
                    .accountNumMasked(response.getAccountNumMasked())
                    .accountSeq(response.getAccountSeq())
                    .accountLocalCode(response.getAccountLocalCode())
                    .accountIssueDate(response.getAccountIssueDate())
                    .maturityDate(response.getMaturityDate())
                    .lastTranDate(response.getLastTranDate())
                    .productName(response.getProductName())
                    .productSubName(response.getProductSubName())
                    .dormancyYn(response.getDormancyYn())
                    .balanceAmt(response.getBalanceAmt())
                    .depositAmt(response.getDepositAmt())
                    .balanceCalcBasis1(response.getBalanceCalcBasis1())
                    .balanceCalcBasis2(response.getBalanceCalcBasis2())
                    .investmentLinkedYn(response.getInvestmentLinkedYn())
                    .bankLinkedYn(response.getBankLinkedYn())
                    .balanceAfterCancelYn(response.getBalanceAfterCancelYn())
                    .savingsBankCode(response.getSavingsBankCode())
                    .build());
        }
        
        return AccountListResponse.builder()
                .accounts(accountResponses)
                .totalCount(accountResponses.size())
                .build();
    }
    
    public AccountListResponse searchAccountsByUserCi(AccountSearchRequest request) {
        return getAccountsByUserCi(request.getUserCi());
    }
    
    public AccountListResponse searchAccountsByUserNum(AccountSearchByUserNumRequest request) {
        User user = userRepository.findByUserNum(request.getUserNum())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        List<Account> accounts = accountRepository.findByUserId(user.getUserId());
        
        List<AccountResponse> accountResponses = accounts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        for (int i = 0; i < accountResponses.size(); i++) {
            AccountResponse response = accountResponses.get(i);
            accountResponses.set(i, AccountResponse.builder()
                    .listNum(i + 1)
                    .bankCodeStd(response.getBankCodeStd())
                    .activityType(response.getActivityType())
                    .accountType(response.getAccountType())
                    .accountNum(response.getAccountNum())
                    .accountNumMasked(response.getAccountNumMasked())
                    .accountSeq(response.getAccountSeq())
                    .accountLocalCode(response.getAccountLocalCode())
                    .accountIssueDate(response.getAccountIssueDate())
                    .maturityDate(response.getMaturityDate())
                    .lastTranDate(response.getLastTranDate())
                    .productName(response.getProductName())
                    .productSubName(response.getProductSubName())
                    .dormancyYn(response.getDormancyYn())
                    .balanceAmt(response.getBalanceAmt())
                    .depositAmt(response.getDepositAmt())
                    .balanceCalcBasis1(response.getBalanceCalcBasis1())
                    .balanceCalcBasis2(response.getBalanceCalcBasis2())
                    .investmentLinkedYn(response.getInvestmentLinkedYn())
                    .bankLinkedYn(response.getBankLinkedYn())
                    .balanceAfterCancelYn(response.getBalanceAfterCancelYn())
                    .savingsBankCode(response.getSavingsBankCode())
                    .build());
        }
        
        return AccountListResponse.builder()
                .accounts(accountResponses)
                .totalCount(accountResponses.size())
                .build();
    }
    
    public AccountMainResponse getMainAccountByUserCi(String userCi) {
        User user = userRepository.findByUserCi(userCi)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        List<Account> accounts = accountRepository.findByUserId(user.getUserId());
        
        if (accounts.isEmpty()) {
            throw new IllegalArgumentException("해당 사용자의 계좌가 존재하지 않습니다.");
        }
        
        Account mainAccount = findMainAccount(accounts);
        return convertToMainResponse(mainAccount);
    }
    
    public AccountMainResponse searchMainAccountByUserCi(AccountSearchRequest request) {
        return getMainAccountByUserCi(request.getUserCi());
    }
    
    public AccountDetailResponse getAccountDetailByUserCi(AccountDetailRequest request) {
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        Account account = accountRepository.findByUserIdAndAccountNum(user.getUserId(), request.getAccountNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않습니다."));
        
        return convertToDetailResponse(account, user);
    }
    
    public AccountBalanceResponse getAccountBalance(AccountBalanceRequest request) {
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        Account account = accountRepository.findByUserIdAndAccountNum(user.getUserId(), request.getAccountNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않습니다."));
        
        return convertToBalanceResponse(account);
    }
    
    private Account findMainAccount(List<Account> accounts) {

        Optional<Account> checkingAccount = accounts.stream()
                .filter(account -> "SAVINGS".equals(account.getAccountType()) || "2".equals(account.getAccountType()))
                .findFirst();

        if (checkingAccount.isPresent()) {
            log.info("당좌계좌로 선택: {}", checkingAccount.get().getAccountNum());
            return checkingAccount.get();
        }

        Optional<Account> recentAccount = accounts.stream()
                .filter(account -> account.getLastTranDate() != null)
                .max(Comparator.comparing(account -> parseDate(account.getLastTranDate())));
        
        if (recentAccount.isPresent()) {
            log.info("최근 거래일 기준으로 선택: {} (거래일: {})", 
                    recentAccount.get().getAccountNum(), 
                    recentAccount.get().getLastTranDate());
            return recentAccount.get();
        }
        
        Optional<Account> highestBalanceAccount = accounts.stream()
                .filter(account -> account.getBalanceAmt() != null)
                .max(Comparator.comparing(Account::getBalanceAmt));
        
        if (highestBalanceAccount.isPresent()) {
            log.info("최고 잔액 기준으로 선택: {} (잔액: {})", 
                    highestBalanceAccount.get().getAccountNum(), 
                    highestBalanceAccount.get().getBalanceAmt());
            return highestBalanceAccount.get();
        }
        
        Account oldestAccount = accounts.stream()
                .filter(account -> account.getAccountIssueDate() != null)
                .min(Comparator.comparing(account -> parseDate(account.getAccountIssueDate())))
                .orElse(accounts.get(0)); 
        
        log.info("개설일 기준으로 선택: {} (개설일: {})", 
                oldestAccount.getAccountNum(), 
                oldestAccount.getAccountIssueDate());
        return oldestAccount;
    }
    
    private LocalDate parseDate(String dateString) {
        try {
            return LocalDate.parse(dateString, DateTimeFormatter.ofPattern("yyyyMMdd"));
        } catch (Exception e) {
            log.warn("날짜 파싱 실패: {}", dateString);
            return LocalDate.MIN; 
        }
    }
    
    private AccountMainResponse convertToMainResponse(Account account) {
        return AccountMainResponse.builder()
                .accountNum(account.getAccountNum())
                .accountNumMasked(account.getAccountNumMasked())
                .productName(account.getProductName())
                .balanceAmt(account.getBalanceAmt())
                .bankCodeStd(account.getBankCodeStd())
                .accountType(account.getAccountType())
                .lastTranDate(account.getLastTranDate())
                .isMainAccount(false) 
                .build();
    }
    
    private AccountResponse convertToResponse(Account account) {
        return AccountResponse.builder()
                .bankCodeStd(account.getBankCodeStd())
                .activityType(account.getActivityType())
                .accountType(account.getAccountType())
                .accountNum(account.getAccountNum())
                .accountNumMasked(account.getAccountNumMasked())
                .accountSeq(account.getAccountSeq())
                .accountLocalCode(account.getAccountLocalCode())
                .accountIssueDate(account.getAccountIssueDate())
                .maturityDate(account.getMaturityDate())
                .lastTranDate(account.getLastTranDate())
                .productName(account.getProductName())
                .productSubName(account.getProductSubName())
                .dormancyYn(account.getDormancyYn())
                .balanceAmt(account.getBalanceAmt())
                .depositAmt(account.getDepositAmt())
                .balanceCalcBasis1(account.getBalanceCalcBasis1())
                .balanceCalcBasis2(account.getBalanceCalcBasis2())
                .investmentLinkedYn(account.getInvestmentLinkedYn())
                .bankLinkedYn(account.getBankLinkedYn())
                .balanceAfterCancelYn(account.getBalanceAfterCancelYn())
                .savingsBankCode(account.getSavingsBankCode())
                .build();
    }

    private AccountDetailResponse convertToDetailResponse(Account account, User user) {
        String bankName = mapBankCodeToName(account.getBankCodeStd());

        String savingsBankName = "050".equals(account.getBankCodeStd()) ?
                mapSavingsBankCodeToName(account.getSavingsBankCode()) : null;

        return AccountDetailResponse.builder()
                .bankName(bankName)
                .savingsBankName(savingsBankName)
                .accountNum(account.getAccountNum())
                .accountSeq(account.getAccountSeq())
                .accountType(mapAccountType(account.getAccountType()))
                .scope("inquiry") 
                .accountNumMasked(account.getAccountNumMasked())
                .payerNum(account.getAccountNum()) 
                .inquiryAgreeYn("Y") 
                .transferAgreeYn("Y") 
                .returnRate(account.getReturnRate())
                .riskLevel(account.getRiskLevel())
                .build();
    }
    
    private String mapBankCodeToName(String bankCode) {
        switch (bankCode) {
            case "088":
                return "신한은행";
            case "011":
                return "농협은행";
            case "003":
                return "기업은행";
            case "004":
                return "국민은행";
            case "020":
                return "우리은행";
            case "081":
                return "하나은행";
            case "050":
                return "저축은행";
            default:
                return "기타은행";
        }
    }
    
    private String mapSavingsBankCodeToName(String savingsBankCode) {
        if (savingsBankCode == null) {
            return null;
        }
        
        switch (savingsBankCode) {
            case "301":
                return "동양저축은행";
            case "302":
                return "웰컴저축은행";
            case "303":
                return "삼정저축은행";
            default:
                return "기타저축은행";
        }
    }
    
    private String mapAccountType(String accountType) {
        if (accountType == null) {
            return "기타";
        }
        
        switch (accountType) {
            case "CHECKING":
                return "수시입출금";
            case "SAVINGS":
                return "예적금";
            case "PENSION_FUND":
                return "연금펀드";
            case "PENSION_TRUST":
                return "연금신탁";
            case "PENSION_INSURANCE":
                return "연금보험";
            case "STOCK":
                return "주식";
            case "1":
                return "수시입출금";
            case "2":
                return "예적금";
            case "6":
                return "수익증권";
            case "T":
                return "종합계좌";
            default:
                return "기타";
        }
    }
    
    private String generateFintechUseNum(String accountNum) {
        return "199999999" + accountNum.substring(0, Math.min(15, accountNum.length()));
    }
    
    private AccountBalanceResponse convertToBalanceResponse(Account account) {
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String bankTranId = "F" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        
        String bankName = mapBankCodeToName(account.getBankCodeStd());
        
        return AccountBalanceResponse.builder()
                .message("계좌 조회 정상처리")
                .bankTranId(bankTranId)
                .bankTranDate(currentDate)
                .bankCodeTran(account.getBankCodeStd())
                .bankRspCode("000")
                .bankRspMessage("정상 처리되었습니다.")
                .bankName(bankName)
                .accountNum(account.getAccountNum())
                .balanceAmt(account.getBalanceAmt() != null ? account.getBalanceAmt().toString() : "0")
                .availableAmt(account.getBalanceAmt() != null ? account.getBalanceAmt().toString() : "0")
                .accountType(account.getAccountType())
                .productName(account.getProductName())
                .accountIssueDate(account.getAccountIssueDate())
                .maturityDate(account.getMaturityDate())
                .lastTranDate(account.getLastTranDate())
                .build();
    }

    @Transactional
    public CreateAccountResponse createAccount(CreateAccountRequest request) {
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        String accountNum = generateAccountNumber();
        
        while (accountRepository.findByAccountNum(accountNum).isPresent()) {
            accountNum = generateAccountNumber();
        }
        
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        String accountNumMasked = maskAccountNumber(accountNum);
        
        Account account = Account.builder()
                .accountNum(accountNum)
                .userId(user.getUserId())
                .bankCodeStd("081") 
                .activityType("1") 
                .accountType(request.getAccountType())
                .accountNumMasked(accountNumMasked)
                .accountSeq("01")
                .accountLocalCode("0000001")
                .accountIssueDate(currentDate)
                .maturityDate(null)
                .lastTranDate(currentDate)
                .productName(request.getProductName())
                .productSubName(null)
                .dormancyYn("N")
                .balanceAmt(BigDecimal.ZERO)
                .depositAmt(BigDecimal.ZERO)
                .balanceCalcBasis1(null)
                .balanceCalcBasis2(null)
                .investmentLinkedYn("N")
                .bankLinkedYn("N")
                .balanceAfterCancelYn("N")
                .savingsBankCode(null)
                .returnRate(request.getReturnRate() != null ? BigDecimal.valueOf(request.getReturnRate()) : null)
                .riskLevel(request.getRiskLevel())
                .build();
        
        Account savedAccount = accountRepository.save(account);
        
        log.info("계좌 생성 완료 - accountNum: {}, userId: {}, productName: {}", 
                savedAccount.getAccountNum(), savedAccount.getUserId(), savedAccount.getProductName());
        
        return CreateAccountResponse.builder()
                .accountNum(savedAccount.getAccountNum())
                .bankCodeStd(savedAccount.getBankCodeStd())
                .productName(savedAccount.getProductName())
                .accountType(savedAccount.getAccountType())
                .accountIssueDate(savedAccount.getAccountIssueDate())
                .returnRate(savedAccount.getReturnRate() != null ? savedAccount.getReturnRate().doubleValue() : null)
                .riskLevel(savedAccount.getRiskLevel())
                .build();
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder accountNum = new StringBuilder("534");
        
        for (int i = 0; i < 10; i++) {
            accountNum.append(random.nextInt(10));
        }
        
        return accountNum.toString();
    }
    
    private String maskAccountNumber(String accountNum) {
        if (accountNum == null || accountNum.length() < 7) {
            return accountNum;
        }
        
        int length = accountNum.length();
        String prefix = accountNum.substring(0, 3);
        String suffix = accountNum.substring(length - 4);
        int maskLength = length - 7;
        
        StringBuilder masked = new StringBuilder(prefix);
        for (int i = 0; i < maskLength; i++) {
            masked.append("*");
        }
        masked.append(suffix);
        
        return masked.toString();
    }
} 
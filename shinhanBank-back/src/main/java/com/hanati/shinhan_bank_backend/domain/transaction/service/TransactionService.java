package com.hanati.shinhan_bank_backend.domain.transaction.service;

import com.hanati.shinhan_bank_backend.domain.account.entity.Account;
import com.hanati.shinhan_bank_backend.domain.account.repository.AccountRepository;
import com.hanati.shinhan_bank_backend.domain.transaction.dto.*;
import com.hanati.shinhan_bank_backend.domain.transaction.entity.Transaction;
import com.hanati.shinhan_bank_backend.domain.transaction.repository.TransactionRepository;
import com.hanati.shinhan_bank_backend.domain.user.entity.User;
import com.hanati.shinhan_bank_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    /**
     * 출금 처리
     */
    public WithdrawResponse processWithdraw(WithdrawRequest request) {
        log.info("출금 처리 시작 - 계좌번호: {}, 금액: {}", request.getWdAccountNum(), request.getTranAmt());

        // 0. 출금 금액 검증
        if (request.getTranAmt() == null || request.getTranAmt().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("출금 금액은 0원보다 커야 합니다.");
        }

        // 1. 사용자 조회 (userCI로 조회)
        User user = userRepository.findByUserCi(request.getUserCI())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 계좌 조회 (사용자의 계좌인지 확인)
        Account account = accountRepository.findByUserIdAndAccountNum(user.getUserId(), request.getWdAccountNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않거나 권한이 없습니다."));

        // 3. 잔액 확인
        if (account.getBalanceAmt().compareTo(request.getTranAmt()) < 0) {
            throw new IllegalArgumentException("잔액이 부족합니다.");
        }

        // 4. 거래 고유번호 생성
        String tranId = generateTranId();

        // 5. 거래 일시 생성
        String tranDtime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        // 6. 잔액 차감 후 새로운 잔액 계산
        BigDecimal newBalance = account.getBalanceAmt().subtract(request.getTranAmt());

        // 7. 계좌 잔액 업데이트
        int updatedRows = accountRepository.updateAccountBalance(account.getAccountId(), newBalance);
        if (updatedRows != 1) {
            throw new IllegalStateException("계좌 잔액 업데이트에 실패했습니다.");
        }

        // 8. 거래 내역 저장
        Transaction transaction = createTransaction(tranId, account, request, newBalance, tranDtime);
        Transaction savedTransaction = transactionRepository.save(transaction);

        log.info("출금 처리 완료 - 거래ID: {}, 출금 후 잔액: {}", tranId, newBalance);

        return createWithdrawResponse(tranId, account, request, newBalance);
    }

    /**
     * 입금 처리
     */
    public DepositResponse processDeposit(DepositRequest request) {
        log.info("입금 처리 시작 - 입금계좌: {}, 금액: {}", request.getReqClientNum(), request.getTranAmt());

        // 0. 입금 금액 검증
        if (request.getTranAmt() == null || request.getTranAmt().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("입금 금액은 0원보다 커야 합니다.");
        }
        log.info("계좌 조회 - 계좌번호: {}",request.getReqClientNum());
        // 1. 계좌 조회 (reqClientNum으로 바로 계좌 찾기)
        Account account = accountRepository.findByAccountNum(request.getReqClientNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않습니다."));

        // 1-1. "이름 모름"인 경우 실제 계좌 주인 이름 조회
        String accountHolderName = request.getAccountHolderName();
        if ("이름 모름".equals(accountHolderName) || "".equals(accountHolderName) || accountHolderName==null) {
            try {
                User accountOwner = userRepository.findById(account.getUserId())
                        .orElse(null);
                if (accountOwner != null) {
                    accountHolderName = accountOwner.getUsername();
                    log.info("계좌 주인 이름 조회 성공 - 계좌번호: {}, 이름: {}", account.getAccountNum(), accountHolderName);
                } else {
                    accountHolderName = null;
                    log.warn("계좌 주인을 찾을 수 없습니다 - 계좌번호: {}", account.getAccountNum());
                }
            } catch (Exception e) {
                log.error("계좌 주인 조회 중 오류 발생 - 계좌번호: {}", account.getAccountNum(), e);
                accountHolderName = null;
            }
        }

        // 2. 거래 고유번호 생성 (요청에 있는 bankTranId 사용)
        String tranId = request.getBankTranId();

        // 3. 거래 일시 사용 (요청에 있는 tranDtime 사용)
        String tranDtime = request.getTranDtime();

        // 4. 잔액 증가 후 새로운 잔액 계산
        BigDecimal newBalance = account.getBalanceAmt().add(request.getTranAmt());

        // 5. 계좌 잔액 업데이트
        int updatedRows = accountRepository.updateAccountBalance(account.getAccountId(), newBalance);
        if (updatedRows != 1) {
            throw new IllegalStateException("계좌 잔액 업데이트에 실패했습니다.");
        }

        // 6. 거래 내역 저장 (조회된 실제 이름 사용)
        Transaction transaction = createDepositTransaction(tranId, account, request, newBalance, tranDtime, accountHolderName);
        Transaction savedTransaction = transactionRepository.save(transaction);

        log.info("입금 처리 완료 - 거래ID: {}, 입금 후 잔액: {}, 계좌주: {}", tranId, newBalance, accountHolderName);

        return createDepositResponse(tranId, account, request, newBalance, accountHolderName);
    }

    // TransactionService.java에 추가할 메서드
    /**
     * 거래내역 조회
     */
    public TransactionHistoryResponse getTransactionHistory(TransactionHistoryRequest request) {
        log.info("거래내역 조회 요청 - CI: {}, 계좌번호: {}, 조회타입: {}, 정렬: {}",
                request.getUserCi(), request.getAccountNum(), request.getInquiryType(), request.getSortOrder());

        // 1. CI로 사용자 조회
        User user = userRepository.findByUserCi(request.getUserCi())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 사용자 ID와 계좌번호로 계좌 조회
        Account account = accountRepository.findByUserIdAndAccountNum(user.getUserId(), request.getAccountNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않습니다."));

        // 3. 거래내역 조회
        List<Transaction> transactions = getTransactionsByInquiryType(account.getAccountId(), request.getInquiryType());

        // 4. 정렬 처리
        transactions = sortTransactions(transactions, request.getSortOrder());

        // 5. 응답 생성
        List<TransactionHistoryItem> historyItems = transactions.stream()
                .map(this::convertToHistoryItem)
                .collect(Collectors.toList());

        return TransactionHistoryResponse.builder()
                .balanceAmt(account.getBalanceAmt().toString())
                .pageRecordCnt(String.valueOf(historyItems.size()))
                .nextPageYn("N")
                .beforeInquiryTraceInfo(generateTraceInfo())
                .resList(historyItems)
                .build();
    }

    private List<Transaction> getTransactionsByInquiryType(Long accountId, String inquiryType) {
        switch (inquiryType.toUpperCase()) {
            case "I": // 입금만
                return transactionRepository.findByAccountIdAndInoutType(accountId, "DEPOSIT");
            case "O": // 출금만
                return transactionRepository.findByAccountIdAndInoutType(accountId, "WITHDRAW");
            case "A": // 모두
            default:
                return transactionRepository.findByAccountId(accountId);
        }
    }

    private List<Transaction> sortTransactions(List<Transaction> transactions, String sortOrder) {
        if ("A".equals(sortOrder.toUpperCase())) {
            // 오름차순 (날짜 오래된 순)
            return transactions.stream()
                    .sorted(Comparator.comparing(Transaction::getTranDate)
                            .thenComparing(Transaction::getTranTime))
                    .collect(Collectors.toList());
        } else {
            // 내림차순 (날짜 최신 순) - 기본값
            return transactions.stream()
                    .sorted(Comparator.comparing(Transaction::getTranDate)
                            .thenComparing(Transaction::getTranTime)
                            .reversed())
                    .collect(Collectors.toList());
        }
    }

    private TransactionHistoryItem convertToHistoryItem(Transaction transaction) {
        return TransactionHistoryItem.builder()
                .tranDate(transaction.getTranDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .tranTime(transaction.getTranTime())
                .inoutType(mapInoutType(transaction.getInoutType()))
                .tranType(mapTranType(transaction.getTranType()))
                .printedContent(transaction.getPrintContent())
                .tranAmt(transaction.getTranAmt().toString())
                .afterBalanceAmt(transaction.getAfterBalanceAmt().toString())
                .branchName(transaction.getBranchName())
                .build();
    }

    private String mapInoutType(String inoutType) {
        switch (inoutType) {
            case "DEPOSIT":
                return "입금";
            case "WITHDRAW":
                return "출금";
            default:
                return "기타";
        }
    }

    private String mapTranType(String tranType) {
        switch (tranType) {
            case "CASH":
                return "현금";
            case "CARD":
                return "카드";
            case "TRANSFER":
                return "이체";
            default:
                return "온라인";
        }
    }

    private String generateTraceInfo() {
        return "1T" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    /**
     * 거래 고유번호 생성
     */
    private String generateTranId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
        return "WD" + timestamp + uuid;
    }

    /**
     * 송금 거래 고유번호 생성
     */
    private String generateTransferTranId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
        return "TF" + timestamp + uuid;
    }

    /**
     * 트랜잭션 엔티티 생성
     */
    private Transaction createTransaction(String tranId, Account account, WithdrawRequest request,
                                          BigDecimal newBalance, String tranDtime) {
        LocalDateTime now = LocalDateTime.now();

        return Transaction.builder()
                .tranId(tranId)
                .accountId(account.getAccountId())
                .tranDate(now.toLocalDate())
                .tranTime(now.format(DateTimeFormatter.ofPattern("HHmmss")))
                .inoutType("WITHDRAW")
                .tranType("ONLINE_WD")
                .printContent(request.getDpsPrintContent())
                .tranAmt(request.getTranAmt())
                .afterBalanceAmt(newBalance)
                .branchName("HANA_ONLINE")
                .wdBankCodeStd(account.getBankCodeStd())
                .wdAccountNum(request.getWdAccountNum())
                .reqClientName(request.getReqClientName())
                .build();
    }

    /**
     * 입금 트랜잭션 엔티티 생성
     */
    private Transaction createDepositTransaction(String tranId, Account account, DepositRequest request,
                                                 BigDecimal newBalance, String tranDtime, String accountHolderName) {
        LocalDateTime now = LocalDateTime.now();

        return Transaction.builder()
                .tranId(tranId)
                .accountId(account.getAccountId())
                .tranDate(now.toLocalDate())
                .tranTime(now.format(DateTimeFormatter.ofPattern("HHmmss")))
                .inoutType("DEPOSIT")
                .tranType("ONLINE_DP")
                .printContent(request.getPrintContent())
                .tranAmt(request.getTranAmt())
                .afterBalanceAmt(newBalance)
                .branchName("HANA_ONLINE")
                .wdBankCodeStd(account.getBankCodeStd())
                .wdAccountNum(request.getReqClientNum())
                .reqClientName(accountHolderName)  // 조회된 실제 이름 사용
                .build();
    }

    /**
     * 출금 응답 생성
     */
    private WithdrawResponse createWithdrawResponse(String tranId, Account account,
                                                    WithdrawRequest request, BigDecimal newBalance) {
        return WithdrawResponse.builder()
                .bankTranId(tranId)
                .dpsPrintContent(request.getDpsPrintContent())
                .accountNum(account.getAccountNum())
                .accountAlias(account.getProductName())
                .bankCodeStd(account.getBankCodeStd())
                .bankCodeSub(account.getAccountLocalCode())
                .bankName(mapBankCodeToName(account.getBankCodeStd()))
                .accountNumMasked(account.getAccountNumMasked())
                .printContent(request.getDpsPrintContent())
                .accountHolderName(request.getReqClientName())
                .tranAmt(request.getTranAmt())
                .wdLimitRemainAmt(newBalance)
                .build();
    }

    /**s
     * 입금 응답 생성
     */
    private DepositResponse createDepositResponse(String tranId, Account account,
                                                  DepositRequest request, BigDecimal newBalance, String accountHolderName) {
        return DepositResponse.builder()
                .tranNo(request.getTranNo())
                .bankTranId(tranId)
                .bankTranDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .bankCodeTran(account.getBankCodeStd())
                .bankRspCode("000")
                .bankRspMessage("")
                .bankName(mapBankCodeToName(account.getBankCodeStd()))
                .accountNum(account.getAccountNum())
                .accountNumMasked(account.getAccountNumMasked())
                .printContent(request.getPrintContent())
                .accountHolderName(accountHolderName)  // 조회된 실제 이름 사용
                .tranAmt(request.getTranAmt())
                .withdrawBankTranId(request.getBankTranId())
                .build();
    }

    /**
     * 은행 코드를 은행명으로 매핑
     */
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
} 
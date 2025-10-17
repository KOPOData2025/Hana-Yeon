package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.account.*;
import com.hanati.hanadundun_backend.entity.Asset;
import com.hanati.hanadundun_backend.entity.AccountDetail;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.repository.AssetRepository;
import com.hanati.hanadundun_backend.repository.AccountDetailRepository;
import com.hanati.hanadundun_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AssetRepository assetRepository;
    private final AccountDetailRepository accountDetailRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final AuthAccessTokenManager authAccessTokenManager;

    @Value("${openbanking.base-url:http://localhost:8081}")
    private String openBankingBaseUrl;

    @Value("${hanaBank.base-url:http://localhost:8082}")
    private String hanaBankBaseUrl;

    public RegisterAccountResponseDto registerAccounts(String userCi, RegisterAccountRequestDto request) {
        log.info("계좌 등록 요청 처리 시작 - userCi: {}", userCi);
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<RegisterAccountResponseDto.AccountRegistrationResultDto> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        for (RegisterAccountRequestDto.AccountRegistrationDto accountDto : request.getAccountList()) {
            RegisterAccountResponseDto.AccountRegistrationResultDto result = registerSingleAccount(user, accountDto);
            results.add(result);
            
            if (result.isSuccess()) {
                successCount++;
            } else {
                failureCount++;
            }
        }
        
        return new RegisterAccountResponseDto(results, successCount, failureCount);
    }

    @Transactional
    private RegisterAccountResponseDto.AccountRegistrationResultDto registerSingleAccount(User user, RegisterAccountRequestDto.AccountRegistrationDto accountDto) {
        try {
            if (accountDetailRepository.existsByAccountNum(accountDto.getAccountNum())) {
                log.info("하나연(緣)에 이미 등록된 계좌입니다 - accountNum: {}", accountDto.getAccountNum());
                return new RegisterAccountResponseDto.AccountRegistrationResultDto(
                    accountDto.getBankcode(), accountDto.getAccountNum(), null,
                    "DUPLICATE_ACCOUNT", "이미 등록된 계좌번호입니다.", false
                );
            }
            
            if (isAccountExistsInOpenBanking(user.getUserCi(), accountDto.getAccountNum())) {
                log.info("OpenBanking에 이미 등록된 계좌입니다 - accountNum: {}", accountDto.getAccountNum());
                return new RegisterAccountResponseDto.AccountRegistrationResultDto(
                    accountDto.getBankcode(), accountDto.getAccountNum(), null,
                    "DUPLICATE_ACCOUNT", "이미 등록된 계좌번호입니다.", false
                );
            }
            
            Long categoryCode = mapAccountCategoryCode(accountDto.getAccountType());
            String assetType = mapAssetType(accountDto.getAccountType());
            Asset asset = new Asset(user.getUserId(), assetType, categoryCode);
            Asset savedAsset = assetRepository.save(asset);
            
                AccountDetail accountDetail = new AccountDetail(
                    accountDto.getAccountNum(),
                    savedAsset.getAssetId(),
                    user.getUserId(),
                    accountDto.getBankcode(),
                    accountDto.getAccountType(), 
                    accountDto.getProductName(),
                    "ACTIVE",
                    parseDate(accountDto.getAccountIssueDate())
                );
            log.info("account type: {}",accountDto.getAccountType());
            
            accountDetailRepository.save(accountDetail);
            
            String fintechUseNum = registerAccountToOpenBanking(user, accountDto);
            
            log.info("계좌 등록 성공 - accountNum: {}", accountDto.getAccountNum());
            
            return new RegisterAccountResponseDto.AccountRegistrationResultDto(
                accountDto.getBankcode(), accountDto.getAccountNum(), fintechUseNum,
                "A0000", "성공", true
            );
            
        } catch (Exception e) {
            log.error("계좌 등록 실패 - accountNum: {}, error: {}", accountDto.getAccountNum(), e.getMessage());
            return new RegisterAccountResponseDto.AccountRegistrationResultDto(
                accountDto.getBankcode(), accountDto.getAccountNum(), null,
                "E0001", "등록 실패: " + e.getMessage(), false
            );
        }
    }

    public List<AccountDto> getAllAccounts(String userCi) {
        log.info("전체 계좌 조회 요청 - userCi: {}", userCi);
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<AccountDetail> accountDetails = accountDetailRepository.findByUserId(user.getUserId());
        List<AccountDto> accountDtos = new ArrayList<>();
        
        for (AccountDetail accountDetail : accountDetails) {
            String balanceAmt = getAccountBalance(user.getUserCi(), accountDetail.getAccountNum(), accountDetail.getInstitutionCode());
            
            Double returnRate = null;
            Integer riskLevel = null;
            if (isPensionAccount(accountDetail.getAccountType())) {
                Map<String, Object> detailInfo = getAccountDetailFromOpenBanking(
                    user.getUserCi(), 
                    accountDetail.getAccountNum(), 
                    accountDetail.getInstitutionCode()
                );
                returnRate = (Double) detailInfo.get("returnRate");
                riskLevel = (Integer) detailInfo.get("riskLevel");
            }
            
            AccountDto accountDto = new AccountDto();
            accountDto.setFintechUseNum(generateFintechUseNum());
            accountDto.setBankCodeStd(accountDetail.getInstitutionCode());
            accountDto.setBankName(getBankName(accountDetail.getInstitutionCode()));
            accountDto.setAccountNum(accountDetail.getAccountNum());
            accountDto.setAccountType(accountDetail.getAccountType());
            accountDto.setAccountTypeName(getAccountTypeName(accountDetail.getAccountType()));
            accountDto.setAccountHolderName(user.getUserName());
            accountDto.setAccountState(accountDetail.getAccountStatus());
            accountDto.setProductName(accountDetail.getProductName());
            accountDto.setBalanceAmt(balanceAmt);
            accountDto.setAccountIssueDate(String.valueOf(accountDetail.getAccountIssueDate()));
            accountDto.setReturnRate(returnRate);
            accountDto.setRiskLevel(riskLevel);
            
            accountDtos.add(accountDto);
            
            log.info("계좌 조회 완료 - accountNum: {}, balance: {}, returnRate: {}, riskLevel: {}", 
                    accountDetail.getAccountNum(), balanceAmt, returnRate, riskLevel);
        }
        
        return accountDtos;
    }

    public AccountTransactionResponseDto getAccountTransactions(String userCi, String accountNum) {
        log.info("계좌 거래내역 조회 요청 - userCi: {}, accountNum: {}", userCi, accountNum);
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        AccountDetail accountDetail = accountDetailRepository.findByAccountNumAndUserId(accountNum, user.getUserId())
            .orElseThrow(() -> new RuntimeException("계좌를 찾을 수 없거나 접근 권한이 없습니다."));
        
        try {
            String url = openBankingBaseUrl + "/v2.0/account/transaction_list/acnt_num";
            
            String currentTime = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            
            Map<String, Object> requestBody = Map.of(
                    "bankTranId", "BANKTRAN" + System.currentTimeMillis(),
                    "bankCodeStd", accountDetail.getInstitutionCode(),
                    "accountNum", accountNum,
                    "userCi", userCi,
                    "inquiryType", "A", // A: 전체, I: 입금, O: 출금
                    "sortOrder", "D", // D: 내림차순(최신순), A: 오름차순
                    "tranDtime", currentTime
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken()); // OpenBanking 토큰 추가
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            log.info("OpenBanking 거래내역 조회 API 호출: {} - accountNum: {}, bankCodeStd: {}", url, accountNum, accountDetail.getInstitutionCode());
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    
                    if (data != null) {
                        // 거래내역 변환
                        List<AccountTransactionResponseDto.TransactionDto> transactions = new ArrayList<>();
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> resList = (List<Map<String, Object>>) data.get("resList");
                        
                        if (resList != null) {
                            for (Map<String, Object> trans : resList) {
                                transactions.add(new AccountTransactionResponseDto.TransactionDto(
                                    (String) trans.get("tranDate"),
                                    (String) trans.get("tranTime"),
                                    (String) trans.get("inoutType"),
                                    (String) trans.get("tranType"),
                                    (String) trans.get("printedContent"),
                                    (String) trans.get("tranAmt"),
                                    (String) trans.get("afterBalanceAmt"),
                                    (String) trans.get("branchName")
                                ));
                            }
                        }
                        
                        return new AccountTransactionResponseDto(
                            (String) data.get("bankName"),
                            (String) data.get("accountNum"),
                            (String) data.get("balanceAmt"),
                            accountDetail.getProductName(),
                            (Integer) data.get("pageRecordCnt"),
                            (String) data.get("nextPageYn"),
                            (String) data.get("beforInquiryTraceInfo"),
                            transactions
                        );
                    }
                }
            }
            
            log.error("OpenBanking 거래내역 조회 실패");
            throw new RuntimeException("거래내역 조회에 실패했습니다.");
            
        } catch (Exception e) {
            log.error("거래내역 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("거래내역 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Transactional
    public void transferMoney(String userCi, TransferRequestDto request) {
        log.info("계좌 이체 요청 - userCi: {}, amount: {}", userCi, request.getTranAmt());
        
        // 사용자 조회
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 출금 계좌 확인
        AccountDetail withdrawAccount = accountDetailRepository.findByAccountNumAndUserId(request.getWdAccountNum(), user.getUserId())
            .orElseThrow(() -> new RuntimeException("출금 계좌를 찾을 수 없거나 접근 권한이 없습니다."));
        
        // OpenBanking API를 통해 실시간 잔액 확인
        String currentBalanceStr = getAccountBalance(user.getUserCi(), request.getWdAccountNum(), withdrawAccount.getInstitutionCode());
        BigDecimal currentBalance = new BigDecimal(currentBalanceStr);
        BigDecimal transferAmount = new BigDecimal(request.getTranAmt());
        
        if (currentBalance.compareTo(transferAmount) < 0) {
            throw new RuntimeException("잔액이 부족합니다.");
        }
        
        boolean withdrawCompleted = false;
        String bankTranId = null;
        String currentTime = null;
        
        try {
            bankTranId = "BANKTRAN" + System.currentTimeMillis();
            currentTime = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            
            // 1. 출금이체 API 호출
            log.info("출금이체 API 호출 시작 - accountNum: {}, amount: {}", request.getWdAccountNum(), request.getTranAmt());
            
            String withdrawUrl = openBankingBaseUrl + "/v2.0/account/withdraw";
            Map<String, Object> withdrawRequestBody = new java.util.HashMap<>();
            withdrawRequestBody.put("bankTranId", bankTranId);
            withdrawRequestBody.put("cntrAccountType", "N");
            withdrawRequestBody.put("cntrAccountNum", request.getWdAccountNum());
            withdrawRequestBody.put("dpsPrintContent", request.getDpsPrintContent() != null ? request.getDpsPrintContent() : "");
            withdrawRequestBody.put("wdBankCodeStd", request.getWdBankCodeStd());
            withdrawRequestBody.put("wdAccountNum", request.getWdAccountNum());
            withdrawRequestBody.put("tranAmt", request.getTranAmt());
            withdrawRequestBody.put("userCi", userCi);
            withdrawRequestBody.put("tranDtime", currentTime);
            withdrawRequestBody.put("reqClientName", user.getUserName());
            withdrawRequestBody.put("reqClientNum", user.getUserId().toString());
            withdrawRequestBody.put("transferPurpose", request.getTransferPurpose() != null ? request.getTransferPurpose() : "TR");
            withdrawRequestBody.put("recvClientName", request.getRecvClientName());
            withdrawRequestBody.put("recvClientBankCode", request.getRecvClientBankCode());
            withdrawRequestBody.put("recvClientAccountNum", request.getRecvClientAccountNum());
            
            HttpHeaders withdrawHeaders = new HttpHeaders();
            withdrawHeaders.setContentType(MediaType.APPLICATION_JSON);
            withdrawHeaders.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            
            HttpEntity<Map<String, Object>> withdrawEntity = new HttpEntity<>(withdrawRequestBody, withdrawHeaders);
            
            ResponseEntity<Map<String, Object>> withdrawResponse = restTemplate.exchange(
                    withdrawUrl,
                    HttpMethod.POST,
                    withdrawEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (withdrawResponse.getStatusCode() != HttpStatus.OK || withdrawResponse.getBody() == null) {
                log.error("출금이체 API 호출 실패");
                throw new RuntimeException("출금이체에 실패했습니다.");
            }
            
            Map<String, Object> withdrawResponseBody = withdrawResponse.getBody();
            Boolean withdrawSuccess = (Boolean) withdrawResponseBody.get("success");
            
            if (!Boolean.TRUE.equals(withdrawSuccess)) {
                String message = (String) withdrawResponseBody.get("message");
                log.error("출금이체 실패: {}", message);
                throw new RuntimeException("출금이체에 실패했습니다: " + message);
            }
            
            withdrawCompleted = true;
            log.info("출금이체 성공 - bankTranId: {}", bankTranId);
            
            // 2. 입금이체 API 호출
            log.info("입금이체 API 호출 시작 - accountNum: {}, amount: {}", request.getRecvClientAccountNum(), request.getTranAmt());
            
            String depositUrl = openBankingBaseUrl + "/v2.0/account/deposit";
            Map<String, Object> depositRequestBody = new java.util.HashMap<>();
            depositRequestBody.put("nameCheckOption", "on");
            depositRequestBody.put("tranDtime", currentTime);
            depositRequestBody.put("tranNo", "00001");
            depositRequestBody.put("bankTranId", bankTranId);
            depositRequestBody.put("bankCodeStd", request.getRecvClientBankCode());
            depositRequestBody.put("accountNum", request.getWdAccountNum());
            depositRequestBody.put("accountHolderName", request.getRecvClientName());
            depositRequestBody.put("printContent", request.getDpsPrintContent() != null ? request.getDpsPrintContent() : "");
            depositRequestBody.put("tranAmt", request.getTranAmt());
            depositRequestBody.put("reqClientNum", user.getUserId().toString());
            depositRequestBody.put("reqClientAccountNum", request.getRecvClientAccountNum());
            depositRequestBody.put("transferPurpose", request.getTransferPurpose() != null ? request.getTransferPurpose() : "TR");
            
            HttpHeaders depositHeaders = new HttpHeaders();
            depositHeaders.setContentType(MediaType.APPLICATION_JSON);
            depositHeaders.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            
            HttpEntity<Map<String, Object>> depositEntity = new HttpEntity<>(depositRequestBody, depositHeaders);
            
            ResponseEntity<Map<String, Object>> depositResponse = restTemplate.exchange(
                    depositUrl,
                    HttpMethod.POST,
                    depositEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (depositResponse.getStatusCode() != HttpStatus.OK || depositResponse.getBody() == null) {
                log.error("입금이체 API 호출 실패 - 출금 보상 트랜잭션 시작");
                throw new RuntimeException("입금이체에 실패했습니다.");
            }
            
            Map<String, Object> depositResponseBody = depositResponse.getBody();
            Boolean depositSuccess = (Boolean) depositResponseBody.get("success");
            
            if (!Boolean.TRUE.equals(depositSuccess)) {
                String message = (String) depositResponseBody.get("message");
                log.error("입금이체 실패: {} - 출금 보상 트랜잭션 시작", message);
                throw new RuntimeException("입금이체에 실패했습니다: " + message);
            }
            
            log.info("입금이체 성공 - bankTranId: {}", bankTranId);
            log.info("이체 처리 완료 - from: {}, to: {}, amount: {}", 
                request.getWdAccountNum(), request.getRecvClientAccountNum(), request.getTranAmt());
                
        } catch (Exception e) {
            log.error("이체 처리 중 오류 발생: {}", e.getMessage(), e);
            
            // 출금은 성공했지만 입금이 실패한 경우, 보상 트랜잭션 실행 (출금 취소)
            if (withdrawCompleted) {
                log.warn("출금은 성공했으나 입금이 실패하여 보상 트랜잭션을 실행합니다.");
                try {
                    rollbackWithdrawal(userCi, request.getWdAccountNum(), request.getWdBankCodeStd(), 
                                      request.getTranAmt(), bankTranId, currentTime, user);
                    log.info("보상 트랜잭션 완료 - 출금된 금액을 원상복구했습니다.");
                    throw new RuntimeException("입금 처리에 실패하여 이체가 취소되었습니다. 출금된 금액은 원상복구되었습니다.");
                } catch (Exception rollbackException) {
                    log.error("보상 트랜잭션 실패: {}", rollbackException.getMessage(), rollbackException);
                    throw new RuntimeException("이체 실패 후 보상 트랜잭션도 실패했습니다. 고객센터에 문의해주세요. 거래번호: " + bankTranId);
                }
            }
            
            throw new RuntimeException("이체 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 출금 보상 트랜잭션 - 출금된 금액을 다시 입금
     */
    private void rollbackWithdrawal(String userCi, String accountNum, String bankCodeStd, 
                                     String amount, String originalBankTranId, String originalTime, User user) {
        log.info("출금 보상 트랜잭션 시작 - accountNum: {}, amount: {}", accountNum, amount);
        
        try {
            String rollbackBankTranId = "ROLLBACK" + System.currentTimeMillis();
            String rollbackTime = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            
            String depositUrl = openBankingBaseUrl + "/v2.0/account/deposit";
            Map<String, Object> depositRequestBody = new java.util.HashMap<>();
            depositRequestBody.put("nameCheckOption", "off");
            depositRequestBody.put("tranDtime", rollbackTime);
            depositRequestBody.put("tranNo", "00001");
            depositRequestBody.put("bankTranId", rollbackBankTranId);
            depositRequestBody.put("bankCodeStd", bankCodeStd);
            depositRequestBody.put("accountNum", accountNum);
            depositRequestBody.put("accountHolderName", user.getUserName());
            depositRequestBody.put("printContent", "이체취소");
            depositRequestBody.put("tranAmt", amount);
            depositRequestBody.put("reqClientNum", user.getUserId().toString());
            depositRequestBody.put("reqClientAccountNum", accountNum);
            depositRequestBody.put("transferPurpose", "RC"); // Rollback/Cancellation
            
            HttpHeaders depositHeaders = new HttpHeaders();
            depositHeaders.setContentType(MediaType.APPLICATION_JSON);
            depositHeaders.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            
            HttpEntity<Map<String, Object>> depositEntity = new HttpEntity<>(depositRequestBody, depositHeaders);
            
            ResponseEntity<Map<String, Object>> depositResponse = restTemplate.exchange(
                    depositUrl,
                    HttpMethod.POST,
                    depositEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (depositResponse.getStatusCode() != HttpStatus.OK || depositResponse.getBody() == null) {
                log.error("보상 입금 API 호출 실패");
                throw new RuntimeException("보상 입금 API 호출에 실패했습니다.");
            }
            
            Map<String, Object> depositResponseBody = depositResponse.getBody();
            Boolean depositSuccess = (Boolean) depositResponseBody.get("success");
            
            if (!Boolean.TRUE.equals(depositSuccess)) {
                String message = (String) depositResponseBody.get("message");
                log.error("보상 입금 실패: {}", message);
                throw new RuntimeException("보상 입금에 실패했습니다: " + message);
            }
            
            log.info("보상 입금 성공 - rollbackBankTranId: {}, originalBankTranId: {}", rollbackBankTranId, originalBankTranId);
            
        } catch (Exception e) {
            log.error("보상 트랜잭션 실행 중 오류: {}", e.getMessage(), e);
            throw new RuntimeException("보상 트랜잭션 실행 실패: " + e.getMessage());
        }
    }

    /**
     * OpenBanking API를 통해 계좌 잔액 실시간 조회
     */
    private String getAccountBalance(String userCi, String accountNum, String bankCodeStd) {
        try {
            String url = openBankingBaseUrl + "/v2.0/account/balance/acnt_num";
            
            String currentTime = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            
            Map<String, Object> requestBody = Map.of(
                    "bankTranId", "BANKTRAN" + System.currentTimeMillis(),
                    "bankCodeStd", bankCodeStd,
                    "accountNum", accountNum,
                    "userCi", userCi,
                    "tranDtime", currentTime
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken()); // OpenBanking 토큰 추가
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            log.info("OpenBanking 잔액 조회 API 호출: {} - accountNum: {}, bankCodeStd: {}", url, accountNum, bankCodeStd);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null && data.get("balanceAmt") != null) {
                        return data.get("balanceAmt").toString();
                    }
                }
                
                log.warn("OpenBanking 잔액 조회 API 응답 실패: {}", responseBody.get("message"));
            }
            
            log.warn("OpenBanking 잔액 조회 API 응답이 예상과 다름: {}", response.getBody());
            return "0";
        } catch (org.springframework.web.client.HttpClientErrorException | org.springframework.web.client.HttpServerErrorException e) {
            log.error("OpenBanking 잔액 조회 API HTTP 오류 - accountNum: {}, bankCodeStd: {}, status: {}, response: {}", 
                    accountNum, bankCodeStd, e.getStatusCode(), e.getResponseBodyAsString());
            return "0"; 
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("OpenBanking 잔액 조회 API 연결 실패 - accountNum: {}, bankCodeStd: {}, error: {}", 
                    accountNum, bankCodeStd, e.getMessage());
            return "0"; 
        } catch (Exception e) {
            log.error("OpenBanking 잔액 조회 API 호출 중 예상치 못한 오류 - accountNum: {}, bankCodeStd: {}, error: {}", 
                    accountNum, bankCodeStd, e.getMessage(), e);
            return "0";
        }
    }


    private String registerAccountToOpenBanking(User user, RegisterAccountRequestDto.AccountRegistrationDto accountDto) {
        try {
            String url = openBankingBaseUrl + "/v2.0/user/register";
            
            String currentTime = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            
            Map<String, Object> requestBody = Map.of(
                    "bankTranId", "BANKTRAN" + System.currentTimeMillis(),
                    "bankCodeStd", accountDto.getBankcode(),
                    "registerAccountNum", accountDto.getAccountNum(),
                    "userInfo", user.getBirthDate(),
                    "userName", user.getUserName(),
                    "userCi", user.getUserCi(),
                    "scope", "inquiry"
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken()); // OpenBanking 토큰 추가
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            log.info("OpenBanking 계좌 등록 API 호출: {} - accountNum: {}", url, accountDto.getAccountNum());
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null && data.get("fintechUseNum") != null) {
                        log.info("OpenBanking 계좌 등록 성공 - fintechUseNum: {}", data.get("fintechUseNum"));
                        return data.get("fintechUseNum").toString();
                    }
                }
                
                log.warn("OpenBanking 계좌 등록 API 응답 실패: {}", responseBody.get("message"));
            }
            
            log.warn("OpenBanking 계좌 등록 실패, 기본 fintechUseNum 생성");
            return generateFintechUseNum();
            
        } catch (Exception e) {
            log.error("OpenBanking 계좌 등록 API 호출 실패 - accountNum: {}, error: {}", 
                    accountDto.getAccountNum(), e.getMessage());
            return generateFintechUseNum(); 
        }
    }

    // OpenBanking에 계좌가 이미 존재하는지 확인
    private boolean isAccountExistsInOpenBanking(String userCi, String accountNum) {
        try {
            String url = openBankingBaseUrl + "/v2.0/account/list";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            log.info("OpenBanking 등록된 계좌 목록 조회: {} - accountNum: {}", url, accountNum);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> accountList = (List<Map<String, Object>>) responseBody.get("data");
                    if (accountList != null) {
                        boolean exists = accountList.stream()
                                .anyMatch(account -> accountNum.equals(account.get("accountNum")));
                        
                        if (exists) {
                            log.info("OpenBanking에 이미 등록된 계좌입니다 - accountNum: {}", accountNum);
                        }
                        return exists;
                    }
                }
            }
            
            return false; 
            
        } catch (Exception e) {
            log.error("OpenBanking 계좌 존재 확인 API 호출 실패 - accountNum: {}, error: {}", 
                    accountNum, e.getMessage());
            return false; 
        }
    }

    private String generateTraceNo() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    private String generateFintechUseNum() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("MWDC");
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
        } catch (Exception e) {
            log.warn("날짜 파싱 실패: {}", dateStr);
            return null;
        }
    }

    private String getBankName(String bankCode) {
        switch (bankCode) {
            case "081": return "하나은행";
            case "088": return "신한은행";
            case "004": return "KB국민은행";
            default: return "기타은행";
        }
    }

    private String getAccountTypeName(String accountType) {
        switch (accountType) {
            case "CHECKING": return "수시입출금";
            case "SAVINGS": return "정기예금";
            case "PENSION_FUND": return "연금펀드";
            case "PENSION_TRUST": return "연금신탁";
            case "PENSION_INSURANCE": return "연금보험";
            case "STOCK": return "주식";
            case "1": return "수시입출금";
            case "2": return "정기예금";
            case "3": return "연금펀드";
            case "4": return "연금신탁";
            case "5": return "연금보험";
            case "6": return "주식";
            default: return "기타";
        }
    }
    
   // 연금 계좌인지 확인
    private boolean isPensionAccount(String accountType) {
        return "PENSION_FUND".equals(accountType) || 
               "PENSION_TRUST".equals(accountType) || 
               "PENSION_INSURANCE".equals(accountType)||
               "IRP".equals(accountType)||
               "RETIREMENT".contains(accountType);
    }
    
    // 연금 상품 추가 정보 조회 - 안쓸듯
    private Map<String, Object> getPensionAccountInfo(String userCi, String accountNum, String bankCodeStd) {
        try {
            String bankApiUrl = getBankApiUrl(bankCodeStd) + "/api/v1/accounts/balance";
            
            Map<String, Object> requestBody = Map.of(
                "userCi", userCi,
                "accountNum", accountNum
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(bankApiUrl, entity, Map.class);
            
            if (response != null && (Boolean) response.get("success")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                return Map.of(
                    "returnRate", data.get("returnRate"),
                    "riskLevel", data.get("riskLevel")
                );
            }
        } catch (Exception e) {
            log.warn("연금 상품 정보 조회 실패 - accountNum: {}, error: {}", accountNum, e.getMessage());
        }
        
        return Map.of("returnRate", null, "riskLevel", null);
    }

    private String getBankApiUrl(String bankCodeStd) {
        switch (bankCodeStd) {
            case "081":
                return "http://localhost:8083"; // 하나은행
            case "088":
                return "http://localhost:8084"; // 신한은행
            default:
                return "http://localhost:8081"; // 기본값
        }
    }


    private Map<String, Object> getAccountDetailFromOpenBanking(String userCi, String accountNum, String bankCodeStd) {
        try {
            String url = openBankingBaseUrl + "/v2.0/account/info";
            
            Map<String, Object> requestBody = Map.of(
                "userCi", userCi,
                "accountNum", accountNum,
                "bankCodeStd", bankCodeStd
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authAccessTokenManager.getAuthAccessToken());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            log.info("OpenBanking 계좌 상세 정보 조회 API 호출: {} - accountNum: {}, bankCodeStd: {}", url, accountNum, bankCodeStd);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null) {
                        log.info("OpenBanking 계좌 상세 정보 조회 성공 - accountNum: {}", accountNum);
                        return data;
                    }
                }
                
                log.warn("OpenBanking 계좌 상세 정보 조회 API 응답 실패: {}", responseBody.get("message"));
            }
            
            log.warn("OpenBanking 계좌 상세 정보 조회 API 응답이 예상과 다름: {}", response.getBody());
            return Map.of("returnRate", null, "riskLevel", null);
            
        } catch (org.springframework.web.client.HttpClientErrorException | org.springframework.web.client.HttpServerErrorException e) {
            log.error("OpenBanking 계좌 상세 정보 조회 API HTTP 오류 - accountNum: {}, bankCodeStd: {}, status: {}, response: {}", 
                    accountNum, bankCodeStd, e.getStatusCode(), e.getResponseBodyAsString());
            return Map.of("returnRate", null, "riskLevel", null);
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("OpenBanking 계좌 상세 정보 조회 API 연결 실패 - accountNum: {}, bankCodeStd: {}, error: {}", 
                    accountNum, bankCodeStd, e.getMessage());
            return Map.of("returnRate", null, "riskLevel", null);
        } catch (Exception e) {
            log.error("OpenBanking 계좌 상세 정보 조회 API 호출 중 예상치 못한 오류 - accountNum: {}, bankCodeStd: {}, error: {}", 
                    accountNum, bankCodeStd, e.getMessage(), e);
            return Map.of("returnRate", null, "riskLevel", null);
        }
    }

    private String mapAccountType(Integer accountType) {
        if (accountType == null) {
            return "CHECKING";
        }
        
        switch (accountType) {
            case 1: return "CHECKING"; // 예금 (수시입출금)
            case 2: return "SAVINGS";  // 적금 (정기예금/적금)
            case 3: return "PENSION";  // 연금
            case 4: return "STOCK";    // 주식
            default: return "CHECKING";
        }
    }

    private Long mapAccountCategoryCode(String accountType) {
        switch (accountType) {
            case "CHECKING": return 1L; // 입출금 계좌
            case "SAVINGS": return 2L; // 정기예금·적금
            case "IRP": return 4L; // IRP
            case "PENSION_FUND": return 5L; // 연금펀드
            case "PENSION_TRUST": return 6L; // 연금신탁
            case "PENSION_INSURANCE": return 7L; // 연금보험
            case "STOCK": return 3L; // 증권 계좌
            default: return 1L; // 기본값: 입출금 계좌
        }
    }

    // accountType에 따라 assetType 매핑
    private String mapAssetType(String accountType) {
        switch (accountType) {
            case "CHECKING":
            case "SAVINGS":
                return "BANK_ACCOUNT"; // 일반 은행 계좌
            case "PENSION_FUND":
                return "PENSION_FUND"; // 연금펀드
            case "PENSION_TRUST":
                return "PENSION_TRUST"; // 연금신탁
            case "PENSION_INSURANCE":
                return "PENSION_INSURANCE"; // 연금보험
            case "IRP":
                return "IRP"; // IRP
            case "STOCK":
                return "STOCK"; // 주식
            default:
                return "BANK_ACCOUNT"; // 기본값: 일반 은행 계좌
        }
    }

    //하나은행 계좌 생성
    @Transactional
    public CreatePensionAccountResponseDto createAccount(String userCi, Long userId, CreatePensionAccountRequestDto request) {
        log.info("계좌 생성 요청 처리 시작 - userCi: {}, productName: {}", userCi, request.getProductName());
        
        User user = userRepository.findByUserCi(userCi)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        try {
            String url = hanaBankBaseUrl + "/api/v1/accounts/create";
            
            Map<String, Object> requestBody = Map.of(
                "userCi", userCi,
                "productName", request.getProductName(),
                "accountType", request.getAccountType(),
                "returnRate", request.getReturnRate(),
                "riskLevel", request.getRiskLevel()
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            log.info("하나은행 계좌 생성 API 호출: {} - userCi: {}", url, userCi);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                
                if (Boolean.TRUE.equals(success)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    
                    if (data != null) {
                        String accountNum = (String) data.get("accountNum");
                        String bankCodeStd = (String) data.get("bankCodeStd");
                        String accountIssueDate = (String) data.get("accountIssueDate");
                        
                        log.info("계좌 생성 성공 - accountNum: {}", accountNum);
                        
                        String accountType = request.getAccountType();
                        if (accountType != null && (accountType.equalsIgnoreCase("IRP") || accountType.toUpperCase().contains("PENSION"))) {
                            user.setQuizPoint(user.getQuizPoint() + 1000);
                            userRepository.save(user);
                        }
                        
                        return CreatePensionAccountResponseDto.builder()
                            .accountNum(accountNum)
                            .bankCodeStd(bankCodeStd)
                            .bankName("하나은행")
                            .productName(request.getProductName())
                            .accountType(request.getAccountType())
                            .accountIssueDate(accountIssueDate)
                            .build();
                    }
                }
                
                String message = (String) responseBody.get("message");
                log.error("하나은행 계좌 생성 실패: {}", message);
                throw new RuntimeException("계좌 생성에 실패했습니다: " + message);
            }
            
            log.error("하나은행 계좌 생성 API 호출 실패");
            throw new RuntimeException("계좌 생성에 실패했습니다.");
            
        } catch (Exception e) {
            log.error("계좌 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("계좌 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
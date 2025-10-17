package com.hanati.open_banking_backend.domain.account.controller;

import com.hanati.open_banking_backend.domain.account.dto.request.AccountDetailsRequest;
import com.hanati.open_banking_backend.domain.account.dto.request.BalanceRequest;
import com.hanati.open_banking_backend.domain.account.dto.request.TransactionListRequest;
import com.hanati.open_banking_backend.domain.account.dto.request.WithdrawRequest;
import com.hanati.open_banking_backend.domain.account.dto.request.DepositRequest;
import com.hanati.open_banking_backend.domain.account.dto.request.IrpTransferRequest;
import com.hanati.open_banking_backend.domain.account.dto.response.AccountDetailInfoResponse;
import com.hanati.open_banking_backend.domain.account.dto.response.BalanceResponse;
import com.hanati.open_banking_backend.domain.account.dto.response.TransactionListResponse;
import com.hanati.open_banking_backend.domain.account.dto.response.WithdrawResponse;
import com.hanati.open_banking_backend.domain.account.dto.response.DepositResponse;
import com.hanati.open_banking_backend.domain.account.dto.response.IrpTransferResponse;
import com.hanati.open_banking_backend.domain.account.service.AccountService;
import com.hanati.open_banking_backend.global.dto.ApiResponse;
import com.hanati.open_banking_backend.global.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v2.0/account")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "계좌 관리", description = "계좌 관련 조회 API")
public class AccountController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    @GetMapping("/list")
    @Operation(summary = "등록된 계좌 목록 조회", description = "OpenBanking에 등록된 모든 계좌 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAccountList() {
        try {
            log.info("등록된 계좌 목록 조회 요청");
            
            List<Map<String, Object>> accountList = accountService.getAccountList();
            
            log.info("등록된 계좌 목록 조회 완료 - 총 {}건", accountList.size());
            return ResponseEntity.ok(ApiResponse.success("계좌 목록 조회가 성공적으로 완료되었습니다.", accountList));
            
        } catch (Exception e) {
            log.error("계좌 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("계좌 목록 조회 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/info")
    @Operation(summary = "계좌 상세 정보 조회", description = "토큰과 계좌 정보를 받아 외부 기관으로부터 상세 정보를 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AccountDetailInfoResponse>> getAccountDetail(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @RequestBody AccountDetailsRequest request) {

        try {
            // 토큰 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            log.info("토큰 인증 성공 - clientId: {}", jwtUtil.extractClientId(token));
            
            AccountDetailInfoResponse response = accountService.getAccountDetailInfo(request);
            return ResponseEntity.ok(ApiResponse.success("계좌 상세 정보 조회가 성공적으로 완료되었습니다.", response));
        } catch (IllegalArgumentException e) {
            log.warn("Account detail info request failed - Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Account detail info request failed - Configuration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 설정 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("Account detail info request failed - Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("계좌 상세 정보 조회 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/balance/acnt_num")
    @Operation(summary = "계좌 잔액 조회", description = "사용자 계좌의 잔액을 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<BalanceResponse>> getAccountBalance(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @RequestBody BalanceRequest request) {
        try {
            // 토큰 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            log.info("토큰 인증 성공 - clientId: {}", jwtUtil.extractClientId(token));
            
            BalanceResponse response = accountService.getAccountBalance(request);
            return ResponseEntity.ok(ApiResponse.success("계좌 잔액 조회가 성공적으로 완료되었습니다.", response));

        } catch (IllegalArgumentException e) {
            log.warn("계좌 잔액 조회 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("외부 API 호출 오류: " + e.getResponseBodyAsString(), e);
            return ResponseEntity.status(e.getStatusCode()).body(ApiResponse.error("외부 기관 통신 오류: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            log.error("계좌 잔액 조회 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("계좌 잔액 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 거래내역조회 API (v2.0)
     */
    @RequestMapping(value = "/transaction_list/acnt_num", method = RequestMethod.POST)
    @Operation(
            summary = "거래내역조회",
            description = "사용자 계좌의 거래내역을 조회합니다.",
            tags = {"계좌 관리"},
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "거래내역조회 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (필수 파라미터 누락, 잘못된 형식 등)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 (유효하지 않은 토큰)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<TransactionListResponse>> getTransactionList(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "거래내역조회 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = TransactionListRequest.class))
            )
            @RequestBody TransactionListRequest request) {

        try {
            log.info("거래내역조회 요청 수신 - accountNum: {}", request.getAccountNum());

            // 1. Authorization 헤더 토큰 추출 및 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            // 2. JWT 토큰에서 Client ID 추출 (로깅용)
            String clientId = jwtUtil.extractClientId(token);
            String scope = jwtUtil.extractScope(token);
            log.info("토큰 인증 성공 - clientId: {}, scope: {}", clientId, scope);

            // 3. 거래내역조회 처리
            TransactionListResponse response = accountService.getTransactionList(request);

            log.info("거래내역조회 성공 - 조회 건수: {}", 
                    response.getResList() != null ? response.getResList().size() : 0);

            return ResponseEntity.ok(
                    ApiResponse.success("거래내역조회가 성공적으로 완료되었습니다.", response)
            );

        } catch (IllegalArgumentException e) {
            log.warn("거래내역조회 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("거래내역조회 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("거래내역조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 출금이체 API (v2.0)
     */
    @PostMapping("/withdraw")
    @Operation(
            summary = "출금이체",
            description = "사용자 계좌에서 출금이체를 수행합니다.",
            tags = {"계좌 관리"},
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "출금이체 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (필수 파라미터 누락, 잘못된 형식 등)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 (유효하지 않은 토큰)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<WithdrawResponse>> withdraw(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "출금이체 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = WithdrawRequest.class))
            )
            @RequestBody WithdrawRequest request) {

        try {
            log.info("출금이체 요청 수신");

            // 1. Authorization 헤더 토큰 추출 및 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            // 2. JWT 토큰에서 Client ID 추출 (로깅용)
            String clientId = jwtUtil.extractClientId(token);
            String scope = jwtUtil.extractScope(token);
            log.info("토큰 인증 성공 - clientId: {}, scope: {}", clientId, scope);

            // 3. 출금이체 처리
            WithdrawResponse response = accountService.withdraw(request);

            log.info("출금이체 성공");

            return ResponseEntity.ok(
                    ApiResponse.success("출금이체가 성공적으로 완료되었습니다.", response)
            );

        } catch (IllegalArgumentException e) {
            log.warn("출금이체 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("출금이체 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("출금이체 중 오류가 발생했습니다."));
        }
    }

    /**
     * 입금이체 API (v2.0)
     */
    @PostMapping("/deposit")
    @Operation(
            summary = "입금이체",
            description = "사용자 계좌로 입금이체를 수행합니다.",
            tags = {"계좌 관리"},
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "입금이체 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (필수 파라미터 누락, 잘못된 형식 등)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 (유효하지 않은 토큰)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<DepositResponse>> deposit(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "입금이체 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = DepositRequest.class))
            )
            @RequestBody DepositRequest request) {

        try {
            log.info("입금이체 요청 수신");

            // 1. Authorization 헤더 토큰 추출 및 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            // 2. JWT 토큰에서 Client ID 추출 (로깅용)
            String clientId = jwtUtil.extractClientId(token);
            String scope = jwtUtil.extractScope(token);
            log.info("토큰 인증 성공 - clientId: {}, scope: {}", clientId, scope);

            // 3. 입금이체 처리
            DepositResponse response = accountService.deposit(request);

            log.info("입금이체 성공");

            return ResponseEntity.ok(
                    ApiResponse.success("입금이체가 성공적으로 완료되었습니다.", response)
            );

        } catch (IllegalArgumentException e) {
            log.warn("입금이체 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("입금이체 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("입금이체 중 오류가 발생했습니다."));
        }
    }

    /**
     * IRP 계좌 이체 API (v2.0)
     */
    @PostMapping("/irp/transfer")
    @Operation(
            summary = "IRP 계좌 이체",
            description = "IRP 계좌로 이체를 수행합니다.",
            tags = {"계좌 관리"},
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "IRP 이체 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (필수 파라미터 누락, 잘못된 형식 등)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 (유효하지 않은 토큰)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<IrpTransferResponse>> irpTransfer(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "IRP 이체 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = IrpTransferRequest.class))
            )
            @RequestBody IrpTransferRequest request) {

        try {
            log.info("IRP 이체 요청 수신");

            // 1. Authorization 헤더 토큰 추출 및 검증
            String token = jwtUtil.extractTokenFromHeader(authorization);
            if (!jwtUtil.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            // 2. JWT 토큰에서 Client ID 추출 (로깅용)
            String clientId = jwtUtil.extractClientId(token);
            String scope = jwtUtil.extractScope(token);
            log.info("토큰 인증 성공 - clientId: {}, scope: {}", clientId, scope);

            // 3. IRP 이체 처리
            IrpTransferResponse response = accountService.irpTransfer(request);

            log.info("IRP 이체 성공");

            return ResponseEntity.ok(
                    ApiResponse.success("IRP 이체가 성공적으로 완료되었습니다.", response)
            );

        } catch (IllegalArgumentException e) {
            log.warn("IRP 이체 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("IRP 이체 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("IRP 이체 중 오류가 발생했습니다."));
        }
    }
}
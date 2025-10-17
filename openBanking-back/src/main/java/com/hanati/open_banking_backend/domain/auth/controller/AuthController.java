package com.hanati.open_banking_backend.domain.auth.controller;

import com.hanati.open_banking_backend.domain.auth.dto.request.TokenRequest;
import com.hanati.open_banking_backend.domain.auth.dto.response.TokenResponse;
import com.hanati.open_banking_backend.domain.auth.service.AuthService;
import com.hanati.open_banking_backend.domain.auth.service.AccountInfoService;
import com.hanati.open_banking_backend.domain.account.dto.request.AccountInfoRequest;
import com.hanati.open_banking_backend.domain.account.dto.response.AccountInfoResponse;
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

@RestController
@RequestMapping("/oauth/2.0")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "OAuth 2.0 인증", description = "OAuth 2.0 Client Credentials Grant 방식의 토큰 발급 및 오픈뱅킹 API")
public class AuthController {
    
    private final AuthService authService;
    private final AccountInfoService accountInfoService;
    private final JwtUtil jwtUtil;
    
    /**
     * OAuth 2.0 Client Credentials Grant 토큰 발급 API
     */
    @Operation(
        summary = "OAuth 2.0 토큰 발급",
        description = "Client Credentials Grant 방식으로 Access Token을 발급합니다. " +
                     "클라이언트 ID와 시크릿을 검증하여 90일간 유효한 JWT 토큰을 반환합니다.",
        tags = {"OAuth 2.0 인증"}
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", 
            description = "토큰 발급 성공",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400", 
            description = "잘못된 요청 (필수 파라미터 누락, 잘못된 scope 등)",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", 
            description = "인증 실패 (잘못된 client_id 또는 client_secret)",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "500", 
            description = "서버 내부 오류",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<TokenResponse>> issueToken(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "토큰 발급 요청 정보", 
                required = true,
                content = @Content(schema = @Schema(implementation = TokenRequest.class))
            )
            @RequestBody TokenRequest request) {
        
        try {
            log.info("OAuth token request received for client: {}, grantType: {}", 
                    request.getClientId(), request.getGrantType());
            
            // 토큰 발급 처리
            TokenResponse response = authService.issueToken(request);
            
            log.info("OAuth token issued successfully for client: {}, clientUseCode: {}", 
                    request.getClientId(), response.getClientUseCode());
            
            return ResponseEntity.ok(
                    ApiResponse.success("토큰이 성공적으로 발급되었습니다.", response)
            );
            
        } catch (IllegalArgumentException e) {
            log.warn("OAuth token failed - Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
                    
        } catch (RuntimeException e) {
            log.error("OAuth token failed - System error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("토큰 발급 중 시스템 오류가 발생했습니다."));
        }
    }

    /**
     * 계좌통합조회 API
     */
    @Operation(
            summary = "계좌통합조회",
            description = "사용자의 모든 계좌 정보를 통합 조회합니다. " +
                    "금융기관 업권별로 조회가 가능하며, 최대 30건까지 조회할 수 있습니다.",
            tags = {"OAuth 2.0 인증"},
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "계좌통합조회 성공",
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
    @PostMapping("/accountinfo/num_list")
    public ResponseEntity<ApiResponse<AccountInfoResponse>> getAccountList(
            @Parameter(hidden = true) @RequestHeader(value = "Authorization", required = false) String authorization,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "계좌통합조회 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AccountInfoRequest.class))
            )
            @RequestBody AccountInfoRequest request) {

        try {
            log.info("계좌통합조회 요청 수신");

            // 1. Authorization 헤더 존재 여부 확인
            if (authorization == null || authorization.trim().isEmpty()) {
                log.warn("Authorization 헤더가 누락됨");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authorization 헤더가 필요합니다. 'Authorization: Bearer {토큰}' 형식으로 요청해주세요."));
            }

            // 2. Authorization 헤더에서 토큰 추출
            String authAccessToken = jwtUtil.extractTokenFromHeader(authorization);

            // 3. JWT 토큰 유효성 검증
            if (!jwtUtil.validateToken(authAccessToken)) {
                log.warn("유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 토큰입니다."));
            }

            // 4. JWT 토큰에서 Client ID 추출 (로깅용)
            String clientId = jwtUtil.extractClientId(authAccessToken);
            String scope = jwtUtil.extractScope(authAccessToken);
            log.info("토큰 인증 성공 - clientId: {}, scope: {}", clientId, scope);

            // 5. 계좌통합조회 처리
            AccountInfoResponse response = accountInfoService.getAccountList(request);

            log.info("계좌통합조회 성공 - 조회 건수: {}", response.getResList().size());

            return ResponseEntity.ok(
                    ApiResponse.success("계좌통합조회가 성공적으로 완료되었습니다.", response)
            );

        } catch (IllegalArgumentException e) {
            log.warn("계좌통합조회 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));

        } catch (Exception e) {
            log.error("계좌통합조회 실패 - 시스템 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("계좌통합조회 중 시스템 오류가 발생했습니다."));
        }
    }
} 
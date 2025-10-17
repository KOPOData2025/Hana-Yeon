package com.hanati.hanabank_backend.domain.irp.controller;

import com.hanati.hanabank_backend.domain.irp.dto.IrpAccountCreateRequestDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpAccountCreateResponseDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpDepositRequestDto;
import com.hanati.hanabank_backend.domain.irp.dto.IrpDepositResponseDto;
import com.hanati.hanabank_backend.domain.irp.service.IrpAccountService;
import com.hanati.hanabank_backend.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/account/retirement")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "IRP 계좌", description = "IRP 계좌 관련 API")
public class IrpAccountController {
    
    private final IrpAccountService irpAccountService;
    
    @PostMapping("/create")
    @Operation(summary = "IRP 계좌 생성", description = "IRP 계좌를 생성합니다")
    public ResponseEntity<ApiResponse<IrpAccountCreateResponseDto>> createIrpAccount(
            @RequestBody IrpAccountCreateRequestDto request) {
        
        log.info("=== IRP 계좌 생성 API 호출 ===");
        log.info("요청 데이터: userCI={}, userName={}, productName={}, irpType={}, irpProductName={}, yieldRate={}, maturityDate={}",
                request.getUserCI(), request.getUserName(), request.getProductName(), 
                request.getIrpType(), request.getIrpProductName(), request.getYieldRate(), request.getMaturityDate());
        
        IrpAccountCreateResponseDto response = irpAccountService.createIrpAccount(request);
        
        log.info("=== IRP 계좌 생성 완료 ===");
        log.info("응답 데이터: accountNum={}, irpType={}, irpProductName={}, maturityDate={}, balanceAmt={}",
                response.getAccountNum(), response.getIrpType(), response.getIrpProductName(), 
                response.getMaturityDate(), response.getBalanceAmt());
        
        return ResponseEntity.ok(ApiResponse.success("요청이 성공적으로 처리되었습니다.", response));
    }
    
    @PostMapping("/deposit")
    @Operation(summary = "IRP 계좌 입금", description = "IRP 계좌에 입금을 처리합니다")
    public ResponseEntity<ApiResponse<IrpDepositResponseDto>> processIrpDeposit(
            @RequestBody IrpDepositRequestDto request) {
        
        log.info("=== IRP 계좌 입금 API 호출 ===");
        log.info("요청 데이터: userCI={}, rsvAccountNum={}, wdAccountNum={}, depositAmt={}, reqClientName={}",
                request.getUserCI(), request.getRsvAccountNum(), request.getWdAccountNum(), 
                request.getDepositAmt(), request.getReqClientName());
        
        IrpDepositResponseDto response = irpAccountService.processIrpDeposit(request);
        
        log.info("=== IRP 계좌 입금 완료 ===");
        log.info("응답 데이터: rsvAccountNum={}, depositAmt={}, balanceAmt={}, irpType={}",
                response.getRsvAccountNum(), response.getDepositAmt(), response.getBalanceAmt(), 
                response.getIrpType());
        
        return ResponseEntity.ok(ApiResponse.success("요청이 성공적으로 처리되었습니다.", response));
    }
} 
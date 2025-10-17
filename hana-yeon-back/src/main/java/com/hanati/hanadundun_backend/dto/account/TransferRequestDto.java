package com.hanati.hanadundun_backend.dto.account;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDto {
    
    private String tranAmt;
    private String dpsPrintContent;
    private String recvClientName;
    private String recvClientBankCode;
    private String recvClientAccountNum;
    private String transferPurpose;
    private String wdBankCodeStd;
    private String wdAccountNum;
}
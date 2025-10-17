package com.hanati.hanabank_backend.domain.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionHistoryResponse {

    @JsonProperty("balanceAmt")
    private String balanceAmt;

    @JsonProperty("pageRecordCnt")
    private String pageRecordCnt;

    @JsonProperty("nextPageYn")
    private String nextPageYn;

    @JsonProperty("beforeInquiryTraceInfo")
    private String beforeInquiryTraceInfo;

    @JsonProperty("resList")
    private List<TransactionHistoryItem> resList;
}
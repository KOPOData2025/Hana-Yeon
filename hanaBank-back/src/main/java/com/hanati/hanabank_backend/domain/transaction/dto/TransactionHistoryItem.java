package com.hanati.hanabank_backend.domain.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionHistoryItem {

    @JsonProperty("tranDate")
    private String tranDate;

    @JsonProperty("tranTime")
    private String tranTime;

    @JsonProperty("inoutType")
    private String inoutType;

    @JsonProperty("tranType")
    private String tranType;

    @JsonProperty("printedContent")
    private String printedContent;

    @JsonProperty("tranAmt")
    private String tranAmt;

    @JsonProperty("afterBalanceAmt")
    private String afterBalanceAmt;

    @JsonProperty("branchName")
    private String branchName;
}
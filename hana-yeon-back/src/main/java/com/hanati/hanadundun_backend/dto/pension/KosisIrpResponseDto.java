package com.hanati.hanadundun_backend.dto.pension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KosisIrpResponseDto {

    @JsonProperty("ITM_NM")
    private String itmNm;

    @JsonProperty("UNIT_NM")
    private String unitNm;

    @JsonProperty("C1_NM")
    private String gender;

    @JsonProperty("C2_NM")
    private String ageGroup;

    @JsonProperty("DT")
    private String value;

    @JsonProperty("PRD_DE")
    private String prdDe;
}
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
public class KosisPeerAverageResponseDto {
    @JsonProperty("PRD_DE")
    private String PRD_DE; // 년도

    @JsonProperty("C2_NM")
    private String C2_NM; // 연령별

    @JsonProperty("C3_NM")
    private String C3_NM; // 연금 종류

    @JsonProperty("DT")
    private String DT; // 월평균 보험료 (천원)
}
package com.hanati.hanadundun_backend.dto.pension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// KOSIS Open API 관련

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) 
public class KosisExpectedReceiveAmountResponseDto {

    /**
     * 데이터 값 - 실제 통계 수치 (항상 문자열로 전송되므로 변환 필요)
     * 예시: "650", "413"
     */
    @JsonProperty("DT")
    private String dataValue;

    /**
     * 항목명 - 데이터가 무엇에 대한 값인지를 나타냄 (가장 중요)
     * 예시: "월평균 수급금액", "연금수급자", "수급률"
     */
    @JsonProperty("ITM_NM")
    private String itemName;

    /**
     * 데이터 기준 연도 - 이 통계가 측정된 연도
     * 예시: "2022"
     */
    @JsonProperty("PRD_DE")
    private String baseYear;

    /**
     * 분류2 이름 (연령 그룹) - 데이터의 연령 그룹을 나타냄
     * 예시: "65~69세"
     */
    @JsonProperty("C2_NM")
    private String ageGroup;

    /**
     * 분류3 이름 (연금 종류) - 데이터의 연금 종류를 나타냄
     * 예시: "국민연금", "개인연금"
     */
    @JsonProperty("C3_NM")
    private String pensionType;
}
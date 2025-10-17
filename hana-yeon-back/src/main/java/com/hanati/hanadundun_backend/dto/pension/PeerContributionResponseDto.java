package com.hanati.hanadundun_backend.dto.pension;

import lombok.Builder;
import lombok.Getter;
import lombok.AllArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
public class PeerContributionResponseDto {
    private final int userAge;
    private final String peerAgeGroup;
    private final long averageTotalContribution;
    private final long nationalPension;
    private final long occupationalPension;
    private final long personalPension;
    private final long totalAccumulatedRetirementPensionAmount;
    private final long maleAccumulatedRetirementPension;
    private final long femaleAccumulatedRetirementPension;
    private final String dataYear;
}
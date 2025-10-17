import { useEffect } from "react";
import { motion } from "motion/react";
// hooks
import { useGetPeerAverage, useGetPeerMonthlyAverage } from "@/hooks/api";
// store
import { useAuthStore } from "@/store";
// utils
import { futureValue } from "@/lib";
// types
import type { IPensionData } from "./Step3PensionInfo";

// const PENSION_FUND_AVERAGE_BENEFIT = 7.6 as const;
// const PENSION_TRUST_AVERAGE_BENEFIT = 5.6 as const;
// const PENSION_INSURANCE_AVERAGE_BENEFIT = 2.6 as const;
// const RETIREMENT_AVERAGE_BENEFIT = 5.18 as const;
//export const PENSION_RETURNRATE_2024 = 3.7;

export const PENSION_RETURNRATE_RECENT10_YEARS = 3.7;
export const PENSION_IRP_RETURNRATE_2024 = 5.86;

const calculatePensionComparison = (
  peerPredictData: any,
  peerMonthlyData: any,
  userInputData: IPensionData,
  userNationalPension: number,
  userAge: number
) => {
  // === 1. 사용자 계산 ===

  // 사용자의 개인연금 계산
  let userPersonalPensionTotal = 0;
  Object.values(userInputData.personalPensions || {}).forEach(
    (pension: IPensionData["personalPensions"][string]) => {
      if (!pension.endAge || pension.endAge <= userAge) {
        return;
      }

      // 납입 기간 = 납입 종료 나이 - 현재 나이
      const contributionYears = pension.endAge - userAge;

      const yearsToRetirement = 65 - userAge;

      const monthlyAmount = futureValue(
        pension.currentAmount,
        pension.predictAmount,
        pension.returnRate,
        yearsToRetirement,
        contributionYears,
        userAge
      );
      userPersonalPensionTotal += monthlyAmount;
    }
  );

  // 사용자의 퇴직연금 계산
  const userRetirementPension = (() => {
    const retirement = userInputData.retirementPension;
    if (!retirement || retirement.contribution <= 0 || !retirement.endAge) {
      return 0;
    }

    if (retirement.endAge <= userAge) {
      // 납입 종료 나이가 현재 나이보다 작으면 계산하지 않음
      return 0;
    }

    // 납입 기간 = 납입 종료 나이 - 현재 나이
    const contributionYears = retirement.endAge - userAge;

    const yearsToRetirement = 65 - userAge;

    return futureValue(
      retirement.balance,
      retirement.contribution,
      retirement.returnRate,
      yearsToRetirement,
      contributionYears,
      userAge
    );
  })();

  // === 2. 또래 계산 ===

  const peerNationalPension = peerPredictData.nationalPension;
  const hasPersonalPensionAccount =
    Object.keys(userInputData.personalPensions || {}).length > 0;
  let peerPersonalPensionMonthly;

  if (hasPersonalPensionAccount) {
    const peerAnnualContribution = peerMonthlyData.personalPension * 12;

    // 사용자가 보유한 개인연금 계좌들의 최대 납입 기간 사용
    const userPersonalAccounts = Object.values(
      userInputData.personalPensions || {}
    );
    const maxContributionYears = Math.max(
      ...userPersonalAccounts.map(
        (pension: IPensionData["personalPensions"][string]) => {
          if (!pension.endAge || pension.endAge <= userAge) return 0;
          return pension.endAge - userAge;
        }
      ),
      0
    );

    const yearsToRetirement = 65 - userAge;

    peerPersonalPensionMonthly = futureValue(
      0,
      peerAnnualContribution,
      PENSION_RETURNRATE_RECENT10_YEARS,
      yearsToRetirement,
      maxContributionYears,
      userAge
    );
  } else {
    peerPersonalPensionMonthly = peerPredictData.personalPension;
  }

  let peerRetirementPensionMonthly;
  const retirement = userInputData.retirementPension;
  const hasValidRetirementPension =
    retirement &&
    retirement.contribution > 0 &&
    retirement.endAge &&
    retirement.endAge > userAge;

  if (hasValidRetirementPension) {
    const contributionYears = retirement.endAge - userAge;
    const yearsToRetirement = 65 - userAge;

    peerRetirementPensionMonthly = futureValue(
      peerMonthlyData.totalAccumulatedRetirementPensionAmount,
      retirement.contribution,
      retirement.returnRate,
      yearsToRetirement,
      contributionYears,
      userAge
    );
  } else {
    peerRetirementPensionMonthly = peerPredictData.retirementPension;
  }

  return {
    user: {
      nationalPension: userNationalPension,
      personalPension: userPersonalPensionTotal,
      retirementPension: userRetirementPension,
      total:
        userNationalPension + userPersonalPensionTotal + userRetirementPension,
    },
    peer: {
      nationalPension: peerNationalPension,
      personalPension: peerPersonalPensionMonthly,
      retirementPension: peerRetirementPensionMonthly,
      total:
        peerNationalPension +
        peerPersonalPensionMonthly +
        peerRetirementPensionMonthly,
    },
    differences: {
      nationalPension: userNationalPension - peerNationalPension,
      personalPension: userPersonalPensionTotal - peerPersonalPensionMonthly,
      retirementPension: userRetirementPension - peerRetirementPensionMonthly,
      total:
        userNationalPension +
        userPersonalPensionTotal +
        userRetirementPension -
        (peerNationalPension +
          peerPersonalPensionMonthly +
          peerRetirementPensionMonthly),
    },
  };
};

export type IPensionComparison = ReturnType<typeof calculatePensionComparison>;

interface Step4AnalyzingProps {
  onComplete: (comparisonData: IPensionComparison) => void;
  userPensionInputData: IPensionData;
  nationalPensionInput: number;
}

export default function Step4Analyzing({
  onComplete,
  userPensionInputData,
  nationalPensionInput,
}: Step4AnalyzingProps) {
  const { userInfo } = useAuthStore();
  const { data: peerPredictAverage } = useGetPeerAverage(
    userInfo?.age ? (userInfo.age > 65 ? userInfo.age : 65) : 65
  );

  const { data: peerMonthlyAverage } = useGetPeerMonthlyAverage(
    userInfo?.age ? (userInfo.age > 65 ? userInfo.age : 65) : 65
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const comparisonData = calculatePensionComparison(
        peerPredictAverage.data,
        peerMonthlyAverage.data,
        userPensionInputData,
        nationalPensionInput,
        userInfo!.age
      );
      onComplete(comparisonData);
    }, 5000);

    return () => clearTimeout(timer);
  }, [
    onComplete,
    peerPredictAverage,
    peerMonthlyAverage,
    userPensionInputData,
    nationalPensionInput,
    userInfo?.age,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-center min-h-[60vh] text-center space-y-6"
    >
      <div className="flex justify-center mb-8">
        <img src="chart.apng" className="w-full" />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          또래 데이터와 비교 분석 중...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          맞춤 분석 리포트 생성 중...
        </p>
      </div>
    </motion.div>
  );
}

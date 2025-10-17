//  연금액산정 : {1.245*(A+B)*P20/P + ... + 1.2*(A+B)*P23/P}(1+0.05n/12) x 지급률
//     A : 연금수급 전 3년간 전체 가입자의 평균 소득월액의 평균액
//     B : 가입자 개인의 가입기간 중 기준소득월액의 평균액
//     n : 20년 초과 가입 월수
//     P : 전체 가입 월수
//     P20~P23 : 연도별 가입월수
//     노령연금의 지급률 : 가입기간 10년 50%(1개월마다 5/12% 증가)

// 연금수급 전 3년간 전체 가입자의 평균 소득월액의 평균액
export const NATIONAL_AVERAGE_INCOME = 3106680;

/**
 * 전체 가입자 평균 소득(A값)을 직접 인수로 받아 예상연금액을 계산합니다.
 * @param monthlyContribution 사용자가 납부하고자 하는 월 보험료
 * @param nationalAverageIncomeA 전체 가입자의 평균 소득월액 (A값)
 * @returns 가입 기간(년)을 키로, 월 예상연금액을 값으로 가지는 객체
 */

export function calculateNationalPension(
  monthlyContribution: number,
  nationalAverageIncomeA = NATIONAL_AVERAGE_INCOME
): { [years: number]: number } {
  const COEFFICIENT = 0.1; // 개인 및 전체 소득(A, B)에 공통으로 적용되는 계수(C)
  const CONTRIBUTION_RATE = 0.09;

  // 1. 사용자의 기준소득월액(B값) 계산 -> 연금액 상한선
  const bValueCap = monthlyContribution / CONTRIBUTION_RATE;

  // 2. '20년 가입 시 예상연금액'을 A와 B를 사용해 직접 계산
  const pensionAt20Years = (nationalAverageIncomeA + bValueCap) * COEFFICIENT;

  const results: { [years: number]: number } = {};
  const contributionPeriods = [10, 15, 20, 25, 30, 35, 40];

  for (const totalYears of contributionPeriods) {
    let calculatedPension: number;
    if (totalYears <= 20) {
      calculatedPension = pensionAt20Years * (totalYears / 20);
    } else {
      const extraYears = totalYears - 20;
      calculatedPension = pensionAt20Years * (1 + 0.05 * extraYears);
    }
    const finalPension = Math.min(calculatedPension, bValueCap);
    results[totalYears] = ~~(finalPension / 10) * 10;
  }
  return results;
}

export const ANNUAL_RATE_DECLINE = 0.5;

export const pensionTaxCalculationByAge = (age: number) => {
  if (age >= 80) return 5.5;
  if (age >= 70) return 4.4;
  return 3.3;
};

/**
 * 예상 연금 수령액 계산
 * @param currentBalance 현재 잔액
 * @param annualContribution 매년 납부할 금액
 * @param yieldRate 수익률
 * @param contributionYears 앞으로 납부할 기간 (납입 종료 나이 - 현재 나이)
 * @param yearsToRetirement 퇴직(65세)까지 남은 기간
 * @returns 예상 수령액
 */
export function futureValue(
  currentBalance: number,
  annualContribution: number,
  yieldRate: number,
  yearsToRetirement: number,
  contributionYears: number = 0,
  userAge: number
) {
  const actualContributionYears =
    contributionYears > 0
      ? Math.min(contributionYears, yearsToRetirement)
      : yearsToRetirement;

  const pensionTax = pensionTaxCalculationByAge(
    userAge + actualContributionYears
  );

  let balance = currentBalance;
  let totalContrib = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const rate = Math.max(
      (yieldRate - ANNUAL_RATE_DECLINE * (year - 1)) / 100,
      0
    );
    // 납입금 추가 (해당 연도 납입)
    if (year <= actualContributionYears) {
      balance += annualContribution;
      totalContrib += annualContribution;
    }
    // 복리 적용
    balance *= 1 + rate;
  }

  const fvTotal = balance;
  const receiveMonths = 20 * 12;

  const monthlyPensionBeforeTax = fvTotal / receiveMonths;
  const monthlyPensionAfterTax =
    monthlyPensionBeforeTax * (1 - pensionTax / 100);

  return monthlyPensionAfterTax;
}

import { useState } from "react";
import { useGetPredictNationalPension } from "@/hooks/api";
import NPSloading from "@/components/ui/NPSloading";

export default function PredictNationalPensionPage() {
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [pensionResults, setPensionResults] = useState<{
    [years: string]: number;
  } | null>(null);

  const { isLoading, refetch } = useGetPredictNationalPension(
    Number(monthlyContribution)
  );

  const handleCalculate = async () => {
    if (!monthlyContribution || isNaN(Number(monthlyContribution))) return;
    const { data } = await refetch();
    setPensionResults(data?.data?.pensionAmountsByPeriod ?? null);
  };

  const entries = pensionResults
    ? Object.entries(pensionResults)
    : [
        ["10년", 0],
        ["15년", 0],
        ["20년", 0],
        ["25년", 0],
        ["30년", 0],
        ["35년", 0],
        ["40년", 0],
      ];

  const last = entries[entries.length - 1];
  const rest = entries.slice(0, -1);

  return (
    <div className="p-4 pb-0 relative">
      <div className="max-w-md mx-auto rounded-lg shadow-sm">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              월 납입보험료
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="tel"
                value={
                  monthlyContribution
                    ? Number(monthlyContribution).toLocaleString()
                    : ""
                }
                onChange={({ target: { value } }) =>
                  setMonthlyContribution(value.replace(/[^0-9]/g, ""))
                }
                placeholder="월 납입보험료를 입력해주세요"
                className="flex-1 px-3 py-2 border text-gray-600 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                원
              </span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-full py-3 bg-gray-600 text-white rounded-md font-medium transition-colors dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            예상연금액 조회하기
          </button>

          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                예상 납부 기간
                <span className="text-xs text-gray-400 dark:text-gray-300">
                  &nbsp;(매월 지급예상액)&nbsp;
                </span>
                을 선택하세요.
              </h3>

              <div className="grid grid-cols-3 gap-2">
                {rest.map(([years, amount]) => (
                  <div
                    key={years}
                    className="p-3 border bg-olo/30 dark:bg-olo/60 border-gray-400 rounded-md text-center transition-colors"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                      {years} 가입
                    </div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {amount ? amount.toLocaleString() + "원" : "-"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full p-3 bg-olo/30 dark:bg-olo/60 border border-gray-400 rounded-md text-center hover:bg-gray-50 transition-colors">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                  {last?.[0]} 가입
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {last?.[1] ? last[1].toLocaleString() + "원" : "-"}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-5">
              전체 가입자 소득평균액을 기준으로 산출한 예상연금액은 아래와
              같습니다.
              <br />
              국민연금 급액(국민연금 1365)로 연락하여 상세내역 확인 가능.
              <br />
              지급예상연금액은 세전금액입니다.
            </div>
          </div>
        </div>
      </div>

      <NPSloading isLoading={isLoading} />
    </div>
  );
}

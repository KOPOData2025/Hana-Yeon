import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
// hooks
import { useInternalRouter, useQuestionContext } from "@/hooks";
import { getInvestTypeText } from "@/lib";
// constants
import { PATH } from "@/constants";
// components
import Button from "@/components/ui/Button";
import { useGetMe } from "@/hooks/api";
import { Check } from "lucide-react";
import { Spacing } from "tosslib";

export function ResultPageContent() {
  const { data: userData } = useGetMe();
  const router = useInternalRouter();

  const { resetSurvey } = useQuestionContext();
  const { totalScore, from } = useLocation().state || {};

  const handleNext = useCallback(async () => {
    resetSurvey();
    if (from === "makePensionSaving") {
      router.push(PATH.MAKE_PENSION_SAVING, { state: { from: "survey" } });
    } else {
      router.replace("/");
    }
  }, [resetSurvey, router]);

  useEffect(() => {
    if (!totalScore) {
      router.replace("/");
    }
  }, [router, totalScore]);

  const type = getInvestTypeText(totalScore ?? 0);
  const userName = userData?.userName || "사용자";

  const getInvestTypeInfo = (type: string) => {
    switch (type) {
      case "안정형":
        return {
          grade: "3등급",
          description:
            "원금 보전을 최우선으로 생각해요. 안정적인 수익을 추구하며, 위험을 최소화하려고 해요.",
          riskLevel: "낮음",
        };
      case "균형형":
        return {
          grade: "2등급",
          description:
            "적정 수익과 위험을 균형있게 고려해요. 시장 평균 수익률을 목표로 하며, 적당한 위험을 수용할 수 있어요.",
          riskLevel: "보통",
        };
      case "공격형":
        return {
          grade: "1등급",
          description:
            "시장평균 수익률보다 높은 수익을 원해요. 원금 손실 위험을 적극적으로 수용할 수 있고, 주식·주식형펀드 또는 파생상품 등의 위험자산에 투자할 의향도 있어요.",
          riskLevel: "높음",
        };
      default:
        return {
          grade: "2등급",
          description: "적정 수익과 위험을 균형있게 고려해요.",
          riskLevel: "보통",
        };
    }
  };

  const investTypeInfo = getInvestTypeInfo(type);

  return (
    <div className="px-4 py-6 bg-background dark:bg-darkBg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {userName}님의 투자성향은
        </h1>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {type}이에요.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            • 투자성향분석일 : {new Date().toLocaleDateString("ko-KR")}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • 금융취약소비자 여부 : 해당없음
          </div>
        </div>

        <div className="text-right mb-6">
          <button className="text-sm text-gray-500 dark:text-gray-400">
            금융소비자 불이익사항 {">"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            ↑ 기대수익
          </span>
        </div>

        <div className="relative">
          <div className="flex h-12 rounded-lg overflow-hidden shadow-sm">
            <div className="flex-1 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-700 dark:to-green-600 relative">
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="text-xs font-medium text-gray-700 dark:text-white">
                  안정형
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-200">
                  3등급
                </div>
              </div>
              {type === "안정형" && (
                <div className="absolute top-1 right-1 text-red-500 font-bold">
                  <Check className="font-bold w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-1 bg-gradient-to-r from-yellow-200 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 relative">
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="text-xs font-medium text-gray-700 dark:text-white">
                  균형형
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-200">
                  2등급
                </div>
              </div>
              {type === "균형형" && (
                <div className="absolute top-0 right-1 text-red-500 font-bold">
                  ✓
                </div>
              )}
            </div>

            <div className="flex-1 bg-gradient-to-r from-red-300 to-red-500 relative">
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="text-xs font-medium text-white">공격형</div>
                <div className="text-xs text-white">1등급</div>
              </div>
              {type === "공격형" && (
                <div className="absolute top-0 right-1 text-white font-bold">
                  ✓
                </div>
              )}
            </div>
          </div>

          <div className="text-right mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              위험도 →
            </span>
          </div>
        </div>
      </div>

      {from === "makePensionSaving" && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            가입가능 상품: {investTypeInfo.grade}(
            {investTypeInfo.riskLevel === "높음"
              ? "매우높은위험"
              : investTypeInfo.riskLevel === "보통"
              ? "보통위험"
              : "낮은위험"}
            )이하
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {investTypeInfo.description}
          </p>

          <div className="text-right">
            <button className="text-sm text-gray-500 dark:text-gray-400">
              투자성향 유형 더보기 {">"}
            </button>
          </div>
        </div>
      )}

      <Spacing size={24} />

      <div className="fixed bottom-0 left-0 right-0 p-4">
        <Button
          className="w-full h-14 bg-olo text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

import { useFunnel } from "@use-funnel/browser";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
// types
import type { TComparePensionFunnelSteps } from "@/types";
// hooks
import { useGetPensionAccount } from "@/hooks/api";
// components
import Step1Intro from "@/components/pension/compare/Step1Intro";
import Step2Loading from "@/components/pension/compare/Step2Loading";
import Step3PensionInfo from "@/components/pension/compare/Step3PensionInfo";
import Step4Analyzing from "@/components/pension/compare/Step4Analyzing";
import Step5Result from "@/components/pension/compare/Step5Result";

export default function ComparePensionPage() {
  const { data: userPensionData } = useGetPensionAccount();

  const [nationalPensionInput, setNationalPensionInput] = useState("");
  const [loadingSteps, setLoadingSteps] = useState({
    openBanking: false,
    retirement: false,
    savings: false,
    processing: false,
  });
  const [userPensionInputData, setUserPensionInputData] = useState<any>();
  const [comparisonData, setComparisonData] = useState<any>();

  const funnel = useFunnel<TComparePensionFunnelSteps>({
    id: "compare-pension-funnel",
    initial: {
      step: "intro",
      context: {},
    },
  });

  const handleStartComparison = (history: any) => {
    history.push("loading", {});

    setTimeout(
      () => setLoadingSteps((prev) => ({ ...prev, openBanking: true })),
      500
    );
    setTimeout(
      () => setLoadingSteps((prev) => ({ ...prev, retirement: true })),
      1200
    );
    setTimeout(
      () => setLoadingSteps((prev) => ({ ...prev, savings: true })),
      1800
    );
    setTimeout(
      () => setLoadingSteps((prev) => ({ ...prev, processing: true })),
      2400
    );
    setTimeout(() => history.push("pensionInfo", {}), 3000);
  };

  const handleAnalyze = (history: any, pensionInputData: any) => {
    setUserPensionInputData(pensionInputData);
    history.push("analyzing", {});
  };

  const handleAnalysisComplete = (
    history: any,
    calculatedComparisonData: any
  ) => {
    setComparisonData(calculatedComparisonData);
    history.push("result", {});
  };

  return (
    <div className="dark:bg-darkBg p-4">
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <funnel.Render
            intro={({ history }) => (
              <Step1Intro
                key="intro"
                onNext={() => handleStartComparison(history)}
              />
            )}
            loading={() => (
              <Step2Loading key="loading" loadingSteps={loadingSteps} />
            )}
            pensionInfo={({ history }) => (
              <Step3PensionInfo
                key="pensionInfo"
                nationalPensionInput={nationalPensionInput}
                onNationalPensionInputChange={setNationalPensionInput}
                onNext={(pensionInputData) =>
                  handleAnalyze(history, pensionInputData)
                }
                userPensionData={userPensionData}
              />
            )}
            analyzing={({ history }) => (
              <Step4Analyzing
                key="analyzing"
                onComplete={(calculatedComparisonData) =>
                  handleAnalysisComplete(history, calculatedComparisonData)
                }
                userPensionInputData={userPensionInputData}
                nationalPensionInput={Number(
                  nationalPensionInput.replace(/,/g, "") || "0"
                )}
              />
            )}
            result={() => (
              <Step5Result key="result" comparisonData={comparisonData} />
            )}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

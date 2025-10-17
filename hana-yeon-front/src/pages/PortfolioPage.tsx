import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
// hooks
import { useGetPortfolio } from "@/hooks/api";
import { useInternalRouter, useMobile } from "@/hooks";
// constants
import { PATH } from "@/constants";
// store
import { useAuthStore } from "@/store";
// components
import Button from "@/components/ui/Button";

export default function PortfolioPage() {
  const { data: apiData } = useGetPortfolio();
  const { userInfo } = useAuthStore();

  const { goHanaBank, goHanaStock, goHanaInsurance } = useMobile();
  const router = useInternalRouter();

  const data = apiData?.data;
  const userName = useMemo(() => userInfo?.userName || "고객", [userInfo]);

  const [step, setStep] = useState<"ready" | "analyzing" | "end">("ready");
  const [analyzingText, setAnalyzingText] = useState<string[]>([]);
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<
    "immediate" | "threeMonths" | "longTerm"
  >("immediate");
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  useEffect(() => {
    if (step !== "analyzing") {
      setAnalyzingText([`${userName}님의 정보를 불러오고 있어요`]);
      return;
    }

    const analyze = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalyzingText((prev) => [...prev, "자산 정보를 불러오고 있어요"]);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setAnalyzingText((prev) => [...prev, "투자 정보를 불러오고 있어요"]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalyzingText((prev) => [...prev, "잠시만 기다려주세요..."]);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("end");
    };

    analyze();
  }, [step, userName]);

  if (step === "ready") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center px-4">
        <img
          src="/hana3dIcon/hanaIcon3d_2_47.png"
          className="w-32"
          alt="Hana 3D Icon"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
          내 자산, 제대로 관리하고 있을까?
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-8">
          AI분석으로 포트폴리오를 진단하고
          <br />
          맞춤 솔루션을 받아보세요.
        </p>
        <Button
          onClick={() => setStep("analyzing")}
          className="w-4/5 max-w-sm h-14 bg-gradient-to-r from-[#00B2A9] to-[#008577] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          진단 시작하기
        </Button>
      </div>
    );
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 text-center">
        <div className="w-full max-w-md pt-24">
          <img
            src="/chart.apng"
            className="w-full mb-4"
            alt="Analyzing Chart"
          />
        </div>

        <div className="flex flex-col items-center w-full mt-4 space-y-1 overflow-hidden">
          <AnimatePresence>
            {analyzingText.map((text, idx) => {
              const isLast = idx === analyzingText.length - 1;

              return (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isLast ? 1 : 0.8,
                    y: isLast ? 0 : -idx * 2,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`${
                    isLast
                      ? "text-lg font-semibold text-gray-800 dark:text-white"
                      : "text-base text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {text}
                </motion.p>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (step === "end" && data) {
    const { portfolioAnalysis, recommendations } = data;

    if (!portfolioAnalysis || !recommendations) return null;

    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkBg dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center text-2xl font-bold text-brand dark:text-olo mb-2">
              <img src="/img-hana-symbol.png" className="w-9 h-9" />
              <span className="ml-2">자산진단 완료</span>
            </div>
            <p className="text-gray-600 dark:text-darkTextSub">
              {userName}님만을 위한 맞춤 분석 결과입니다
            </p>
          </motion.div>

          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-brand to-olo px-6 py-5 rounded-t-xl shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center">
                {portfolioAnalysis.title || "맞춤형 포트폴리오 분석"}
              </h2>
            </div>

            <div className="p-6 bg-white dark:bg-darkCard rounded-b-xl border-l-4 border-r-4 border-b-4 border-brand dark:border-olo shadow-lg">
              <p className="text-base text-gray-700 dark:text-darkTextMain leading-relaxed">
                {portfolioAnalysis.summary ||
                  "현재 고객님의 자산 현황에 대한 분석 결과입니다."}
              </p>
            </div>
          </motion.section>

          {portfolioAnalysis.improvementPoints &&
            portfolioAnalysis.improvementPoints.length > 0 && (
              <motion.section
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-brand dark:text-olo mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  핵심 개선 전략
                </h3>
                <div className="grid gap-4">
                  {portfolioAnalysis.improvementPoints.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                      className="group p-5 bg-white dark:bg-darkCard rounded-xl border-l-4 border-olo hover:border-brand transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-brand to-olo rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-sm">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 font-semibold dark:text-darkTextMain leading-relaxed group-hover:text-brand dark:group-hover:text-olo transition-colors duration-300">
                          {point}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

          {portfolioAnalysis?.customSolutions &&
            portfolioAnalysis.customSolutions.length > 0 && (
              <motion.section
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-brand dark:text-olo mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  하나금융 맞춤 솔루션
                </h3>
                <div className="space-y-4">
                  {portfolioAnalysis.customSolutions.map((solution, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                    >
                      <div
                        className="p-5 bg-white dark:bg-darkCard rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-brand dark:hover:border-olo transition-all duration-300 shadow-md hover:shadow-lg group"
                        onClick={() =>
                          setExpandedSolution(
                            expandedSolution === idx ? null : idx
                          )
                        }
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-800 dark:text-darkTextMain group-hover:text-brand dark:group-hover:text-olo transition-colors duration-300 flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-brand to-olo rounded-full mr-3"></div>
                            {solution.title}
                          </h4>
                          <motion.span
                            animate={{
                              rotate: expandedSolution === idx ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="text-brand dark:text-olo text-lg font-bold"
                          >
                            ▼
                          </motion.span>
                        </div>
                        <AnimatePresence>
                          {expandedSolution === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-700 dark:text-darkTextMain mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 leading-relaxed">
                                {solution.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {expandedSolution !== idx && (
                          <p className="text-gray-500 dark:text-darkTextSub mt-3 text-sm line-clamp-2">
                            {solution.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

          {portfolioAnalysis.executionRoadmap && (
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold text-brand dark:text-olo mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                단계별 실행 계획
              </h3>

              <div className="flex space-x-2 mb-6">
                {(["immediate", "threeMonths", "longTerm"] as const).map(
                  (tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        activeRoadmapTab === tab
                          ? "bg-gradient-to-r from-brand to-olo text-white shadow-lg"
                          : "bg-white dark:bg-darkCard text-gray-700 dark:text-darkTextMain hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      }`}
                      onClick={() => setActiveRoadmapTab(tab)}
                    >
                      {tab === "immediate"
                        ? "지금 바로"
                        : tab === "threeMonths"
                        ? "3개월 목표"
                        : "장기 목표"}
                    </motion.button>
                  )
                )}
              </div>

              <motion.div
                key={activeRoadmapTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md"
              >
                <div className="space-y-3">
                  {(activeRoadmapTab === "immediate"
                    ? portfolioAnalysis.executionRoadmap.immediate
                    : activeRoadmapTab === "threeMonths"
                    ? portfolioAnalysis.executionRoadmap.threeMonths
                    : portfolioAnalysis.executionRoadmap.longTerm
                  )?.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * idx }}
                      className="flex items-start p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-olo hover:border-brand transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-brand to-olo rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-xs">
                          {idx + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-darkTextMain leading-relaxed group-hover:text-brand dark:group-hover:text-olo transition-colors duration-300">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          )}

          {recommendations?.length > 0 && (
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="grid gap-4">
                {recommendations.map((rec, idx) => {
                  const productNames: { [key: string]: string } = {
                    isa: "ISA",
                    irp: "IRP",
                    personalPension: "연금저축",
                    stock: "주식투자",
                    insurance: "보험",
                  };

                  const getClickHandler = (recommendation: string) => {
                    if (recommendation.includes("personalPension")) {
                      return () => router.push(PATH.MAKE_PENSION_SAVING);
                    }
                    if (
                      recommendation.includes("irp") ||
                      recommendation.includes("isa")
                    ) {
                      return goHanaBank;
                    } else if (recommendation.includes("stock")) {
                      return goHanaStock;
                    } else if (recommendation.includes("insurance")) {
                      return goHanaInsurance;
                    }
                    return goHanaBank;
                  };

                  return (
                    <motion.button
                      key={idx}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                      onClick={getClickHandler(rec)}
                      className="p-4 bg-gradient-to-r from-brand to-olo text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-center">
                        <p className="text-gray-100 leading-relaxed group-hover:text-brand dark:group-hover:text-olo transition-colors duration-300">
                          {productNames[rec] || rec}
                          {rec === "insurance" ? " 들고" : ""}
                          {rec === "personalPension" ? " 만들고" : ""}
                          {rec === "stock" ? " 하고" : ""}
                          {rec === "isa" || rec === "irp" ? " 만들고" : ""}
                        </p>
                        <img
                          src="/hanamoney.png"
                          className="w-5 h-5 ml-2 mr-1"
                        />
                        <p>받기</p>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    );
  }

  return null;
}

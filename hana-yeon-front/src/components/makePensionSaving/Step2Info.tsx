import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useInternalRouter } from "@/hooks";
import { PATH } from "@/constants";

interface Step2InfoProps {
  history: any;
  context: {
    selectedType: "discretionary" | "trust";
  };
}

export default function Step2Info({ history, context }: Step2InfoProps) {
  const [showTaxDetail, setShowTaxDetail] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(true);
  const [openSurveyDrawer, setOpenSurveyDrawer] = useState(false);

  const router = useInternalRouter();

  const handleJoin = () => {
    router.push(PATH.SURVEY, {
      state: { selectedType: context.selectedType, from: "makePensionSaving" },
    });
  };

  return (
    <div className="flex flex-col h-full dark:bg-darkBg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 pb-4"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          행복 Knowhow 연금저축계좌(집합투자증권)
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          일석이조!
        </h1>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          세액공제 받고 투자하고
        </h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-300 dark:to-pink-300 rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-base text-gray-600 mb-1">세액공제 혜택</p>
              <p className="text-xl font-bold text-purple-600">
                연간 최대 900만원
              </p>
            </div>
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src="/pigMoney.png"
                alt="세액공제"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-base text-gray-600 mb-1">세액공제율</p>
            <p className="text-xl font-bold text-purple-600">최대 16.5%</p>
          </div>

          <button
            onClick={() => setShowTaxDetail(!showTaxDetail)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between cursor-pointer border-none"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              *세액공제 자세히 보기
            </span>
            {showTaxDetail ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {showTaxDetail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3 bg-white dark:bg-gray-800 rounded-xl p-4 overflow-hidden"
              >
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      가입금액
                    </p>
                    <p>
                      각 펀드 상품별 최저가입금액 1천원 이상 (MMF 및
                      상품매매(종목전환)신규제외)
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      납입한도
                    </p>
                    <p>연간 1,800만원(전 금융기관 합산) + ISA전환금액*</p>
                    <p className="text-xs mt-1">
                      *ISA전환금액이란, ISA계좌의 계약기간 만료일로부터 60일
                      이내에 만기 해지자금의 전부 또는 일부를 연금계좌에 납입한
                      금액
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      적립기간
                    </p>
                    <p>5년이상</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      연금수령요건
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        만55세이상 & 가입일로부터 5년 경과 (단, 퇴직금이 포함된
                        경우 만 55세 이상)
                      </li>
                      <li>연금수령한도 내에서 10년이상 연금 수령</li>
                      <li>연금수령 개시신청 필수</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={() => setShowProductDetail(!showProductDetail)}
          className="w-full bg-white dark:bg-darkCard rounded-xl p-4 flex items-center justify-between cursor-pointer border border-gray-200 dark:border-gray-700 mb-3"
        >
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            상품특징확인하기
          </span>
          {showProductDetail ? (
            <ChevronUp className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </motion.button>

        <AnimatePresence>
          {showProductDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white dark:bg-darkCard rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6 overflow-hidden"
            >
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  연금저축계좌란?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  한 계좌에서 하위펀드로 다수의 연금펀드 보유가 가능 하며
                  상품매매를 통해 시장상황 및 투자성향에 적합한 포트폴리오 단위
                  운용가능
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  가입대상
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  각 펀드 상품별 최저가입금액 1천원 이상 (MMF 및
                  상품매매(종목전환)신규제외)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  납입한도
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  연간 1,800만원(전 금융기관 합산) + ISA전환금액*
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  *ISA전환금액이란, ISA계좌의 계약기간 만료일로부터 60일 이내에
                  만기 해지자금의 전부 또는 일부를 연금계좌에 납입한 금액
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  적립기간
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  5년이상
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  연금수령요건
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    만55세이상 & 가입일로부터 5년 경과 (단, 퇴직금이 포함된 경우
                    만 55세 이상)
                  </li>
                  <li>연금수령한도 내에서 10년이상 연금 수령</li>
                  <li>연금수령 개시신청 필수</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-olo rounded-full text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      연금저축계좌 신규
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-olo rounded-full text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      MMF(필수)를 포함한 하위펀드 신규 (최대5개)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-olo rounded-full text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      연금저축계좌 하위펀드의 분배비율로 하위펀드 에 입금(향후
                      연금계좌로 입금 시 사전에 지정된
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 p-6"
      >
        <button
          onClick={() => setOpenSurveyDrawer(true)}
          className="w-full bg-olo hover:bg-olo/80 text-white font-semibold py-4 rounded-xl transition-colors border-none cursor-pointer text-lg"
        >
          가입하기
        </button>
      </motion.div>

      <AnimatePresence>
        {openSurveyDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setOpenSurveyDrawer(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeOut",
              }}
              className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white dark:bg-gray-800 rounded-t-xl z-50 shadow-lg"
            >
              <div className="p-6">
                <div className="w-12 h-1 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto mb-6" />

                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  상품에 가입하기 전 투자성향진단이 필요해요
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  투자성향진단을 통해 맞춤형 상품을 추천해드립니다
                </p>

                <button
                  onClick={handleJoin}
                  className="w-full bg-olo hover:bg-olo/80 text-white font-semibold py-4 rounded-xl transition-colors border-none cursor-pointer text-base"
                >
                  진단하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

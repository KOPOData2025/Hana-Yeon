import { motion } from "motion/react";

interface Step1IntroProps {
  onNext: () => void;
}

export default function Step1Intro({ onNext }: Step1IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-[75vh] flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="flex justify-center mb-8">
        <img className="w-full" src="gumgo.apng" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          나는 또래보다 얼마나 받을까?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          퇴직연금, 연금저축 등을 종합하여
          <br />
          또래와 비교 분석해드려요
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-[#00B2A9] to-[#008577] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        또래와 비교하기
      </motion.button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        개인정보는 안전하게 보호되며, 비교 분석 목적으로만 사용됩니다.
      </p>
    </motion.div>
  );
}

import { motion } from "motion/react";
import { CheckCircle, Clock } from "lucide-react";

interface LoadingSteps {
  openBanking: boolean;
  retirement: boolean;
  savings: boolean;
  processing: boolean;
}

interface Step2LoadingProps {
  loadingSteps: LoadingSteps;
}

export default function Step2Loading({ loadingSteps }: Step2LoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-center min-h-[60vh] text-center space-y-6"
    >
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 border-4 border-olo border-t-transparent rounded-full animate-spin"></div>
      </div>

      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        연금 정보를 가져오고 있어요
      </h2>

      <div className="space-y-4">
        <motion.div
          className={`flex items-center space-x-3 p-4 rounded-xl ${
            loadingSteps.openBanking
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-white dark:bg-darkCard"
          } shadow-sm`}
          animate={{
            backgroundColor: loadingSteps.openBanking ? "#f0fdf4" : "#ffffff",
          }}
        >
          {loadingSteps.openBanking ? (
            <CheckCircle className="w-5 h-5 text-olo" />
          ) : (
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          )}
          <span
            className={
              loadingSteps.openBanking
                ? "text-olo"
                : "text-gray-500 dark:text-gray-300"
            }
          >
            오픈뱅킹 연결 완료
          </span>
        </motion.div>

        <motion.div
          className={`flex items-center space-x-3 p-4 rounded-xl ${
            loadingSteps.retirement
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-white dark:bg-darkCard"
          } shadow-sm`}
          animate={{
            backgroundColor: loadingSteps.retirement ? "#f0fdf4" : "#ffffff",
          }}
        >
          {loadingSteps.retirement ? (
            <CheckCircle className="w-5 h-5 text-olo" />
          ) : (
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          )}
          <span
            className={
              loadingSteps.retirement
                ? "text-olo"
                : "text-gray-500 dark:text-gray-300"
            }
          >
            퇴직연금 정보 수집 완료
          </span>
        </motion.div>

        <motion.div
          className={`flex items-center space-x-3 p-4 rounded-xl ${
            loadingSteps.savings
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-white dark:bg-darkCard"
          } shadow-sm`}
          animate={{
            backgroundColor: loadingSteps.savings ? "#f0fdf4" : "#ffffff",
          }}
        >
          {loadingSteps.savings ? (
            <CheckCircle className="w-5 h-5 text-olo" />
          ) : (
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          )}
          <span
            className={
              loadingSteps.savings
                ? "text-olo"
                : "text-gray-500 dark:text-gray-300"
            }
          >
            연금저축 정보 수집 완료
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

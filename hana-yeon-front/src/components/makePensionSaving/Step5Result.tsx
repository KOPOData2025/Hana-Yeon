import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/constants/path";
import { Spacing } from "tosslib";
import { Coins } from "lucide-react";

interface Step5ResultProps {
  context: any;
}

export default function Step5Result({ context }: Step5ResultProps) {
  const navigate = useNavigate();
  const {
    receivingAge,
    pensionReceiveAccount,
    accountName,
    createdAccountNum,
  } = context;

  const handleGoHome = () => {
    navigate(PATH.HOME, { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-darkBg px-6">
      <Spacing size={40} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <img src="hana3dIcon/hanaIcon3d_4_65.png" className="w-40 h-40" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2"
        >
          연금저축 만들고
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="text-3xl font-bold text-olo dark:text-brand">
            1000
          </span>
          <img src="hanamoney.png" className="w-6 h-6" />
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            받았어요!
          </span>
        </motion.div>
      </motion.div>

      <Spacing size={40} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-darkCard rounded-2xl p-6 mb-4"
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">계좌명</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {accountName}
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">계좌번호</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {createdAccountNum}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-darkCard rounded-2xl p-6"
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              수령 시작 나이
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              만 {receivingAge}세
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              연금 받으실 계좌
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {pensionReceiveAccount}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="pb-6"
      >
        <button
          onClick={handleGoHome}
          className="w-full bg-olo text-white font-semibold py-4 rounded-xl border-none cursor-pointer text-lg"
        >
          홈으로
        </button>
      </motion.div>
    </div>
  );
}

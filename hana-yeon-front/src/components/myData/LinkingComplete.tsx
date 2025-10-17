import { motion } from "motion/react";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useInternalRouter } from "@/hooks";
import { PATH } from "@/constants";

const features = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "자산 현황",
    description: "모든 자산을 한눈에 확인하세요",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "자산 관리",
    description: "포트폴리오를 분석하고 관리해드려요",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "안전한 관리",
    description: "암호화된 보안으로 안전해요",
  },
];

export default function LinkingComplete() {
  const router = useInternalRouter();

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <img
            src="/hana3dIcon/hanaIcon3d_4_67.png"
            alt="연결 완료"
            className="w-32 h-32 object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-16">
            연결이 완료되었어요!
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="font-semibold text-gray-700 dark:text-white mb-4">
            이제&nbsp;
            <span className="text-olo">하나</span>
            <span className="text-yeon">연(緣)</span>
            에서 이런 기능을 사용할 수 있어요
          </div>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-brand/60 to-brand/90 dark:from-brand/30 dark:to-brand/50 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-gray-700 dark:text-gray-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full bg-olo text-white py-5 rounded-lg font-bold text-lg hover:bg-brand/90 transition-colors flex items-center justify-center mb-20"
          onClick={() => router.push(PATH.HOME)}
        >
          홈으로
        </motion.button>
      </div>
    </div>
  );
}

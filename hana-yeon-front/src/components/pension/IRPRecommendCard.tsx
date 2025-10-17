import { motion } from "motion/react";
import { ChevronRight, Calculator, TrendingUp } from "lucide-react";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
// constants
import { PATH } from "@/constants/path";

export default function IRPRecommendCard() {
  const router = useInternalRouter();

  const goPredictNationalPension = () => {
    router.push(PATH.PREDICT_NATIONAL_PENSION);
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#E8F4F8] to-[#B8D4E3] pt-4 text-center h-[250px] mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold text-[#2E3B42]">
        <span className="text-olo">국민연금</span>
        &nbsp; 얼마나 받을까?
      </h2>

      {/* 연금 아이콘 이미지 */}
      <motion.div
        className="relative w-[50%] h-[210px] max-w-md bg-no-repeat bg-cover transform top-2 left-2"
        style={{
          backgroundImage: 'url("/nps.png")',
          backgroundPosition: "center top",
          backgroundSize: "contain",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      <div className="absolute bottom-4 right-2 z-10">
        <div className="relative">
          <div className="flex justify-center gap-4 mb-4">
            <motion.div
              className="text-olo dark:text-brand"
              animate={{
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <TrendingUp className="w-8 h-8" fill="currentColor" />
            </motion.div>

            <motion.div
              className="text-olo dark:text-brand"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                className="w-10 h-10"
                src="/hana3dIcon/hanaIcon3d_2_87.png"
              />
            </motion.div>
          </div>
          <motion.button
            onClick={goPredictNationalPension}
            className="bg-gradient-to-r from-olo/80 to-brand/80 hover:from-brand hover:to-olo text-white font-bold p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              계산하기
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

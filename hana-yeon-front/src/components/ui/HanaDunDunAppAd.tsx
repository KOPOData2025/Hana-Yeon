import { ChartBarBig, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { PATH } from "@/constants/path";
import { useInternalRouter } from "@/hooks";

export default function HanaDunDunAppAd() {
  const router = useInternalRouter();
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#E8F4F8] to-[#B8D4E3] pt-4 text-center h-[250px] mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 배경 이미지 */}
      <motion.div
        className="absolute top-3 left-0 w-full h-full bg-no-repeat bg-center bg-contain -z-10"
        style={{
          backgroundImage: 'url("/bg_things.png")',
          zIndex: 3,
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1.2, 1.15, 1.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <h2 className="text-xl font-bold text-[#2E3B42]">
        <span className="text-olo">하나</span>
        <span className="text-yeon">연(緣)</span>
        에서
        <br />
        AI <span className="text-[#00928F]">자산진단</span>
        &nbsp;받아보세요!
      </h2>

      <img
        className="absolute w-3/5 left-[20%] transform -translate-x-[20%]"
        src="/logo_with_hand2.png"
      />

      <motion.div
        className="absolute bottom-4 right-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <motion.button
          onClick={() => router.push(PATH.PORTFOLIO)}
          className="bg-gradient-to-r from-olo to-brand hover:from-[#007A7A] hover:to-[#00928F] text-white font-bold p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <ChartBarBig className="w-5 h-5" />
            진단받기 <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { Brain, Trophy, Star, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { GlobalPortal } from "tosslib";
// components
import QuizModal from "./QuizModal";

export default function QuizBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b to-[#E8F4F8] from-[#B8D4E3] pt-4 text-center h-[250px] mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold text-[#2E3B42]">오늘의 퀴즈 도착!</h2>

      <img
        className="absolute w-3/5 -left-4 -bottom-8 max-w-md"
        src="/solvingQuiz.gif"
      />

      <div className="absolute bottom-4 right-2 z-10">
        <div className="relative">
          <div className="flex justify-center gap-4 mb-4">
            <motion.div
              className="text-[#00928F] dark:text-[#00B8A3]"
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
              <Star className="w-8 h-8" fill="currentColor" />
            </motion.div>

            <motion.div
              className="text-[#007A7A] dark:text-[#00A8A8]"
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
              <Trophy className="w-6 h-6" fill="currentColor" />
            </motion.div>
          </div>
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-olo to-brand hover:from-[#007A7A] hover:to-[#00928F] text-white font-bold p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              퀴즈 풀기 <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
      <GlobalPortal.Consumer>
        <QuizModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </GlobalPortal.Consumer>
    </motion.div>
  );
}

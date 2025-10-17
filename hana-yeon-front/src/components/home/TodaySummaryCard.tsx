import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { summaryItems } from "@/constants";

interface TodaySummaryCardProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function TodaySummaryCard({
  isExpanded = false,
  onToggle,
}: TodaySummaryCardProps) {
  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl p-5">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          오늘의 금융 요약
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mt-4">
              {summaryItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.text}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.highlight}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

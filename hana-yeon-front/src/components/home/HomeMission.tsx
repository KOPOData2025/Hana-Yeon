import { motion, AnimatePresence } from "motion/react";
import { X, StickyNote, CheckCircle } from "lucide-react";
import { useGetUserMissions } from "@/hooks/api";

interface Mission {
  id: number;
  title: string;
  reward: number;
  isCompleted: boolean;
}

interface HomeMissionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomeMission({ isOpen, onClose }: HomeMissionProps) {
  const { data: userMissions } = useGetUserMissions();

  const missions: Mission[] = userMissions ?? [];
  const isEmpty = missions.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-md"
          >
            <div className="bg-white dark:bg-darkCard rounded-b-3xl shadow-2xl p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  미션
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <StickyNote className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-base">
                    현재 할 수 있는 미션이 없어요
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="bg-gray-50 dark:bg-darkBg rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {mission.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        {!mission.isCompleted ? (
                          <>
                            <span className="text-olo font-bold">
                              {mission.reward}
                            </span>
                            <img
                              src="hanamoney.png"
                              alt="하나머니"
                              className="w-5 h-5"
                            />
                          </>
                        ) : (
                          <CheckCircle className="w-5 h-5 text-olo" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

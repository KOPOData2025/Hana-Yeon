import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useSessionStorage } from "usehooks-ts";
// hooks
import { useInternalRouter } from "@/hooks";
// constants
import { PATH } from "@/constants";

interface ByulButPopUpProps {
  popupContent?: React.ReactNode;
  onPopupClose?: () => void;
  onClick?: () => void;
}

export default function ByulButPopUp({
  popupContent,
  onPopupClose,
  onClick,
}: ByulButPopUpProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showNewBadge, setShowNewBadge] = useSessionStorage(
    "show-new-badge",
    true
  );
  const router = useInternalRouter();

  const handlePopupClose = () => {
    onPopupClose?.();
  };

  const handleCharacterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.();
    setShowNewBadge(false);
    router.push(PATH.AI_CHAT);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.2,
      }}
      className="fixed bottom-[90px] right-3 sm:right-[calc(50vw-(384px/2)-12px)] z-10"
    >
      <div className="relative">
        {popupContent && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-20 right-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 min-w-[280px] border border-gray-100 dark:border-gray-700"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))",
            }}
          >
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700 rotate-45"></div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePopupClose();
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>

            {popupContent}
          </motion.div>
        )}

        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCharacterClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-2xl border-2 border-olo/20 overflow-hidden hover:border-olo/40 transition-all duration-300"
          style={{
            filter: "drop-shadow(0 8px 25px rgba(0, 0, 0, 0.15))",
          }}
        >
          <img
            src="byubutHi.apng"
            alt="별벗이"
            className="w-full h-full object-cover"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-olo/20 to-transparent"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-olo"
          />
        </motion.button>

        {showNewBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">N</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

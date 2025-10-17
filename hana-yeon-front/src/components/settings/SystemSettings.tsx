import { useState, type MouseEvent } from "react";
import { X, Moon, Sun, Type, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { themeStore } from "@/store/themeStore";

interface SystemSettingsProps {
  onClose: () => void;
}

export default function SystemSettings({ onClose }: SystemSettingsProps) {
  const { theme, toggleTheme, fontSize, setFontSize } = themeStore();
  const [showFontSettings, setShowFontSettings] = useState(false);

  const fontSizeOptions = [
    { value: "small", label: "작게" },
    { value: "medium", label: "중간" },
    { value: "large", label: "크게" },
    { value: "xLarge", label: "매우 크게" },
  ];

  const toggleFontSettings = () => {
    setShowFontSettings((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-darkCard text-black dark:text-white"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">시스템 설정</h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-darkCard">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
                <div>
                  <p className="font-semibold">다크모드</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {theme === "dark" ? "켜짐" : "꺼짐"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-olo" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-darkCard">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={toggleFontSettings}
            >
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-semibold">폰트 크기</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {
                      fontSizeOptions.find((opt) => opt.value === fontSize)
                        ?.label
                    }
                  </p>
                </div>
              </div>
              <button className="p-1 transition-colors rounded-lg">
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    showFontSettings ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {showFontSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 mt-2 space-y-2 border-t border-gray-300 dark:border-zinc-600">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setFontSize(
                            option.value as
                              | "small"
                              | "medium"
                              | "large"
                              | "xLarge"
                          )
                        }
                        className={`w-full p-3 text-left transition-colors rounded-lg ${
                          fontSize === option.value
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

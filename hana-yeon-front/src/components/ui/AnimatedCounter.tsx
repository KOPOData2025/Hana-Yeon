import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function AnimatedDigit({ digit }: { digit: number }) {
  return (
    <div className="relative inline-block w-8 h-12 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={digit}
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-olo"
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface AnimatedCounterProps {
  className?: string;
  onFinish?: () => void;
}

export default function AnimatedCounter({
  className,
  onFinish,
}: AnimatedCounterProps) {
  const values = [2, 24, 27, 38, 59, 71, 79, 92, 100];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= values.length - 1) {
          clearInterval(interval);
          onFinish?.();
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [values.length]);

  const currentValue = values[currentIndex];

  const hundredsDigit = Math.floor(currentValue / 100) % 10;
  const tensDigit = Math.floor(currentValue / 10) % 10;
  const onesDigit = currentValue % 10;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {currentValue >= 100 && <AnimatedDigit digit={hundredsDigit} />}
      {currentValue >= 10 && <AnimatedDigit digit={tensDigit} />}
      <AnimatedDigit digit={onesDigit} />
      <span className="text-4xl font-bold text-olo ml-1">%</span>
    </div>
  );
}

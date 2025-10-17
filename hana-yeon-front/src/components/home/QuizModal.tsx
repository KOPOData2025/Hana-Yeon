import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, XCircle } from "lucide-react";
// hooks
import { useGetTodayQuiz, useCheckQuizAnswer } from "@/hooks/api/quiz";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { data: quizData, isLoading, error } = useGetTodayQuiz();
  const checkQuizMutation = useCheckQuizAnswer();

  const quiz = quizData?.data;
  const isCorrect = checkQuizMutation.data?.data?.isCorrect;

  useEffect(() => {
    if (quiz?.isAlreadyAnswered) {
      setSelectedAnswer(quiz.selectedAnswer || null);
      setIsAnswered(true);
    } else {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [quiz]);

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !quiz) return;

    checkQuizMutation.mutate(
      {
        quizId: quiz.quizId,
        selectedAnswer: selectedAnswer,
      },
      {
        onSuccess: () => {
          setIsAnswered(true);
        },
      }
    );
  };

  const handleClose = () => {
    onClose();
    if (!quiz?.isAlreadyAnswered) {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  if (isLoading || error || !quiz) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white dark:bg-darkCard rounded-2xl w-full max-w-sm p-6 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <img src="hana3dIcon/hanaIcon3d_2_107.png" className="w-7" />
                <span className="text-base font-semibold text-olo">
                  오늘의 퀴즈
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                {quiz.question}
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {quiz.options.map((option) => {
                let buttonClass =
                  "w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ";

                if (!isAnswered) {
                  buttonClass +=
                    selectedAnswer === option.optionText
                      ? "border-olo bg-olo/10 text-olo font-semibold"
                      : "border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-darkCard text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/40";
                } else {
                  if (
                    quiz.wasCorrect &&
                    option.optionText === quiz.selectedAnswer
                  ) {
                    buttonClass +=
                      "border-blue-500 bg-blue-500/10 text-blue-500";
                  } else if (
                    selectedAnswer === option.optionText &&
                    !quiz.wasCorrect
                  ) {
                    buttonClass += "border-red-500 bg-red-500/10 text-red-500";
                  } else {
                    buttonClass +=
                      "border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-darkCard text-gray-600 dark:text-gray-300";
                  }
                }

                return (
                  <button
                    key={option.optionId}
                    onClick={() =>
                      !isAnswered && setSelectedAnswer(option.optionText)
                    }
                    className={buttonClass}
                    disabled={isAnswered}
                  >
                    <span>{option.optionText}</span>
                    {isAnswered &&
                      (quiz.wasCorrect &&
                      option.optionText === quiz.selectedAnswer ? (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : selectedAnswer === option.optionText &&
                        !quiz.wasCorrect ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null)}
                  </button>
                );
              })}
            </div>

            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer || checkQuizMutation.isPending}
                className="w-full bg-olo hover:bg-olo/90 disabled:bg-gray-200 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {checkQuizMutation.isPending ? "확인 중..." : "정답 확인"}
              </button>
            ) : (
              <div className="text-center">
                <div
                  className={`text-lg font-bold mb-2 ${
                    (quiz.isAlreadyAnswered ? quiz.wasCorrect : isCorrect)
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {(quiz.isAlreadyAnswered ? quiz.wasCorrect : isCorrect)
                    ? "정답입니다! 🎉"
                    : "틀렸습니다 😢"}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {checkQuizMutation.data?.data?.explanation ||
                    (quiz.isAlreadyAnswered
                      ? "이미 답변한 퀴즈입니다."
                      : "정답입니다!")}
                </p>
                {checkQuizMutation.data?.data && !quiz.isAlreadyAnswered && (
                  <p className="text-sm text-olo font-semibold mb-4">
                    +{checkQuizMutation.data.data.earnedPoint}P 획득!
                  </p>
                )}
                <button
                  onClick={handleClose}
                  className="w-full bg-olo hover:bg-olo/90 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  완료
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

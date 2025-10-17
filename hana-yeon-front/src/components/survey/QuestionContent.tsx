import { useCallback, useEffect, useState } from "react";
import { Spacing, Text } from "tosslib";
// hooks
import { usePostInvestType } from "@/hooks/api";
import { useInternalRouter, useQuestionContext } from "@/hooks";
import { canProceedToNext, getInvestTypeText } from "@/lib";
// types
import type { AnswerType, AnyQuestion } from "@/types";
import type { ContextAnswer } from "@/provider/QuestionContextProvider";
// constants
import { SURVEY_QUESTIONS, PATH } from "@/constants";
// components
import Question from "./Question";
import { QuestionProgressBar } from "./QuestionProgressBar";
import Button from "@/components/ui/Button";
import { useLocation } from "react-router-dom";

export function QuestionPageContent() {
  const {
    initializeWithData,
    getCurrentQuestionAndAnswer,
    handleNextQuestion,
    totalScore,
  } = useQuestionContext();
  const router = useInternalRouter();
  const location = useLocation();

  const { mutateAsync: postInvestType } = usePostInvestType();

  const { currentQuestion } = getCurrentQuestionAndAnswer();
  const [currentAnswer, setCurrentAnswer] = useState<ContextAnswer | null>(
    null
  );

  useEffect(() => {
    initializeWithData(SURVEY_QUESTIONS);
  }, []);

  useEffect(() => {
    if (currentQuestion?.type === "scale") {
      const { min, scoreUnit } = currentQuestion.scaleRange;
      setCurrentAnswer({
        questionId: currentQuestion.id,
        answer: min,
        score: min * scoreUnit,
      });
    }
  }, [currentQuestion]);

  const handleAnswerChange = useCallback(
    (questionId: number, answer: AnswerType, score: number) => {
      setCurrentAnswer({ questionId, answer, score });
    },
    []
  );

  const handleNextClick = async () => {
    const result = handleNextQuestion(currentQuestion, currentAnswer);

    setCurrentAnswer(null);

    if (result.shouldNavigateToResult && result?.resultData != null) {
      await postInvestType({ investType: getInvestTypeText(totalScore) });
      router.push(PATH.SURVEY_RESULT, {
        state: { totalScore, ...location.state },
      });
    }
  };

  const canProceed = canProceedToNext(currentQuestion, currentAnswer);

  return (
    <>
      <QuestionProgressBar />
      <Spacing size={24} />
      {currentQuestion && (
        <CurrentQuestion
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswerChange={handleAnswerChange}
        />
      )}

      <Button
        className="absolute h-14 bottom-10 left-5 right-5 !bg-primary"
        onClick={handleNextClick}
        disabled={!canProceed}
      >
        다음
      </Button>
    </>
  );
}

interface CurrentQuestionProps {
  currentQuestion: AnyQuestion;
  currentAnswer: ContextAnswer | null;
  onAnswerChange: (
    questionId: number,
    answer: AnswerType,
    score: number
  ) => void;
}

function CurrentQuestion({ currentQuestion, ...rest }: CurrentQuestionProps) {
  const { id, type } = currentQuestion;

  switch (type) {
    case "binary":
      return <Question.Binary key={id} question={currentQuestion} {...rest} />;
    case "multiple":
      return (
        <Question.Multiple key={id} question={currentQuestion} {...rest} />
      );
    case "scale":
      return <Question.Scale key={id} question={currentQuestion} {...rest} />;
    default:
      return (
        <Text color="hsl(var(--foreground))">알 수 없는 질문 타입입니다.</Text>
      );
  }
}

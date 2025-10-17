import {
  createContext,
  useState,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from "react";
// types
import type { AnyQuestion, AnswerType } from "@/types";
import {
  flattenQuestions,
  getInvestTypeText,
  getNextUnansweredQuestion,
  getSubQuestions,
} from "@/lib";

export type ContextAnswer = {
  questionId: number;
  answer: AnswerType;
  score: number;
};

export interface QuestionContextValue {
  allFlatQuestions: AnyQuestion[];
  currentQuestionId: number | null;
  answers: Map<number, ContextAnswer>;
  totalScore: number;

  goToQuestion: (questionId: number) => void;
  getCurrentQuestionAndAnswer: () => {
    currentQuestion: AnyQuestion | null;
    currentAnswerState: ContextAnswer | null;
  };
  resetSurvey: () => void;
  initializeWithData: (questions: AnyQuestion[] | any[]) => void;
  handleNextQuestion: (
    currentQuestion: AnyQuestion | null,
    currentAnswer: ContextAnswer | null
  ) => { shouldNavigateToResult: boolean; resultData?: any };
}

export const QuestionContext = createContext<QuestionContextValue | null>(null);

export function QuestionContextProvider({ children }: PropsWithChildren) {
  const [allFlatQuestions, setAllFlatQuestions] = useState<AnyQuestion[]>([]);
  const [questionToSolve, setQuestionToSolve] = useState<
    Map<number, AnyQuestion>
  >(new Map());
  const [answers, setAnswers] = useState<Map<number, ContextAnswer>>(new Map());
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  const totalScore = useMemo(
    () =>
      Array.from(answers.values()).reduce((sum, { score }) => sum + score, 0),
    [answers]
  );

  const initializeWithData = useCallback((questions: AnyQuestion[] | any[]) => {
    const flatQuestions = flattenQuestions(questions);
    setAllFlatQuestions(flatQuestions);

    const initialQuestionToSolve = new Map(
      questions.map((question) => [question.id, question])
    );
    setAnswers(new Map());
    setCurrentQuestionId(questions[0]?.id ?? null);
    setQuestionToSolve(initialQuestionToSolve);

    const nextQuestionId = getNextUnansweredQuestion(
      initialQuestionToSolve,
      new Set(answers.keys())
    );
    setCurrentQuestionId(nextQuestionId);
  }, []);

  const goToQuestion = useCallback((questionId: number) => {
    setCurrentQuestionId(questionId);
  }, []);

  const getCurrentQuestionAndAnswer = useCallback(() => {
    if (!currentQuestionId) {
      return { currentQuestion: null, currentAnswerState: null };
    }

    return {
      currentQuestion:
        allFlatQuestions.find(({ id }) => id === currentQuestionId) ?? null,
      currentAnswerState: answers.get(currentQuestionId) ?? null,
    };
  }, [allFlatQuestions, currentQuestionId, answers]);

  const resetSurvey = async () => {
    setAnswers(new Map());
    setCurrentQuestionId(null);
  };

  const handleNextQuestion = useCallback(
    (
      currentQuestion: AnyQuestion | null,
      currentAnswer: ContextAnswer | null
    ) => {
      if (currentQuestion == null || currentAnswer == null) {
        return { shouldNavigateToResult: false };
      }

      const updatedQuestionToSolve = new Map(questionToSolve);
      const updatedAnswers = new Map(answers);
      updatedAnswers.set(currentAnswer.questionId, currentAnswer);

      const subQuestions = getSubQuestions(
        currentQuestion,
        currentAnswer.answer
      );
      subQuestions?.forEach((subQuestion) => {
        updatedQuestionToSolve.set(subQuestion.id, subQuestion);
      });

      setQuestionToSolve(updatedQuestionToSolve);
      setAnswers(updatedAnswers);

      const isLastQuestion =
        updatedQuestionToSolve.size === updatedAnswers.size;

      // CASE 1: 마지막 질문이거나 완료된 경우 - 결과 계산 및 제출
      if (isLastQuestion) {
        const type = getInvestTypeText(totalScore);

        // saveCurrentAnswer은 비동기라 반영이 안되어 ,마지막 문제 다시 넣어야함
        const dataForSubmit = { answers: Array.from(updatedAnswers.values()) };

        return {
          shouldNavigateToResult: true,
          resultData: dataForSubmit,
          type,
        };
      }

      const nextQuestionId = getNextUnansweredQuestion(
        updatedQuestionToSolve,
        new Set(updatedAnswers.keys())
      );

      if (nextQuestionId) {
        goToQuestion(nextQuestionId);
      }

      return { shouldNavigateToResult: false };
    },
    [totalScore, answers, questionToSolve, goToQuestion]
  );

  const value: QuestionContextValue = {
    allFlatQuestions,
    currentQuestionId,
    answers,
    totalScore,
    goToQuestion,
    getCurrentQuestionAndAnswer,
    resetSurvey,
    initializeWithData,
    handleNextQuestion,
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

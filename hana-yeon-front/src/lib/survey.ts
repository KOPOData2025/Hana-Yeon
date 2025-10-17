import type {
  AnswerType,
  AnyQuestion,
  Question,
  SavedAnswerType,
} from "@/types";
import type { ContextAnswer } from "@/provider/QuestionContextProvider";

export const getInvestTypeText = (totalScore: number) => {
  if (totalScore <= 10) {
    return "안정형";
  }
  if (totalScore <= 20) {
    return "균형형";
  }
  return "공격형";
};

export function canProceedToNext(
  currentQuestion: AnyQuestion | null,
  currentAnswer: ContextAnswer | null
): boolean {
  if (!currentQuestion) {
    return false;
  }

  if (currentAnswer && currentAnswer.questionId === currentQuestion.id) {
    switch (currentQuestion.type) {
      case "binary":
        return currentAnswer.answer === "yes" || currentAnswer.answer === "no";

      case "multiple":
        return (
          Array.isArray(currentAnswer.answer) && currentAnswer.answer.length > 0
        );

      case "scale":
        return typeof currentAnswer.answer === "number";

      default:
        return false;
    }
  }

  return false;
}

export function flattenQuestions(questions: AnyQuestion[]) {
  const result: AnyQuestion[] = [];

  for (const question of questions) {
    result.push(question);

    if (question.type === "binary") {
      const { yes, no } = question.options;
      if (yes.subQuestions) {
        result.push(...flattenQuestions(yes.subQuestions as AnyQuestion[]));
      }
      if (no.subQuestions) {
        result.push(...flattenQuestions(no.subQuestions as AnyQuestion[]));
      }
    }
  }

  return result;
}

export function calculateScoreForAnswer(
  allQuestions: AnyQuestion[],
  questionId: number,
  answer: AnswerType
) {
  const question = allQuestions.find(({ id }) => id === questionId);
  if (!question) {
    return 0;
  }

  switch (question.type) {
    case "binary":
      return question.options[answer as "yes" | "no"].score;
    case "multiple":
      if (Array.isArray(answer)) {
        return answer.reduce((sum, label) => {
          const option = question.options.find((opt) => opt.label === label);
          return sum + (option?.score || 0);
        }, 0);
      }
      return 0;
    case "scale":
      return typeof answer === "number"
        ? answer * question.scaleRange.scoreUnit
        : 0;
    default:
      return 0;
  }
}

export const calculateMultipleAnswerScore = (
  question: Question<"multiple">,
  answers: string[]
) => {
  const score = answers.reduce((acc, answer) => {
    const option = question.options.find(({ label }) => label === answer);
    return acc + (option?.score || 0);
  }, 0);

  return score;
};

export const isBinaryQuestion = (
  question?: AnyQuestion
): question is Question<"binary"> => {
  return question?.type === "binary";
};

export const isMultipleQuestion = (
  question?: AnyQuestion
): question is Question<"multiple"> => {
  return question?.type === "multiple";
};

export const isScaleQuestion = (
  question?: AnyQuestion
): question is Question<"scale"> => {
  return question?.type === "scale";
};

export const isBinaryAnswer = (answer?: AnswerType): answer is "yes" | "no" => {
  return answer === "yes" || answer === "no";
};

export const isMultipleAnswer = (answer?: AnswerType): answer is string[] => {
  return Array.isArray(answer);
};

export const isScaleAnswer = (answer?: AnswerType): answer is number => {
  return typeof answer === "number";
};

export const hasSubQuestions = (
  question: AnyQuestion,
  answer: "yes" | "no"
) => {
  return (
    isBinaryQuestion(question) && question.options[answer]?.subQuestions != null
  );
};

export const getNextUnansweredQuestion = (
  questionToSolve: Map<number, AnyQuestion>,
  answeredQuestionIds: Set<number>
): number | null => {
  const sortedIds = Array.from(questionToSolve.keys()).sort((a, b) => a - b);

  for (const id of sortedIds) {
    if (!answeredQuestionIds.has(id)) {
      return id;
    }
  }

  return null;
};

export const getSubQuestions = (
  question?: AnyQuestion,
  answer?: AnswerType
) => {
  if (!isBinaryQuestion(question) || !isBinaryAnswer(answer)) {
    return [];
  }
  return question.options[answer]?.subQuestions ?? [];
};

export const processSavedData = (
  flatQuestions: AnyQuestion[],
  savedAnswers: SavedAnswerType[],
  initialQuestionToSolve: Map<number, AnyQuestion>
) => {
  const answeredQuestionIds = new Set<number>();
  const updatedAnswers = new Map<number, ContextAnswer>();
  const updatedQuestionToSolve = new Map(initialQuestionToSolve);

  savedAnswers.forEach((savedAnswer: SavedAnswerType) => {
    const { questionId, answer } = savedAnswer;

    const score = calculateScoreForAnswer(flatQuestions, questionId, answer);
    updatedAnswers.set(questionId, { questionId, answer, score });
    answeredQuestionIds.add(questionId);

    const question = flatQuestions.find(({ id }) => id === questionId);
    const subQuestions = getSubQuestions(question, answer);
    subQuestions?.forEach((subQuestion) => {
      updatedQuestionToSolve.set(subQuestion.id, subQuestion);
    });
  });

  return {
    updatedAnswers,
    answeredQuestionIds,
    updatedQuestionToSolve,
  };
};

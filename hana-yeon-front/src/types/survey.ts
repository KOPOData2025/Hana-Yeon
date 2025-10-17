export type QuestionType = "binary" | "multiple" | "scale";
export type InvestType = "안정형" | "균형형" | "공격형";
export type AnswerType = "yes" | "no" | string[] | number;

export type BaseQuestion<T extends QuestionType> = {
  id: number;
  type: T;
  question: string;
};

export type BinaryOption = {
  label: string;
  score: number;
  subQuestions?: AnyQuestion[];
};

export type MultipleOption = {
  label: string;
  score: number;
};

export type ScaleOption = {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  scoreUnit: number;
};

export type Question<T extends QuestionType> = BaseQuestion<T> &
  (T extends "multiple"
    ? {
        options: MultipleOption[];
        maxSelect: number;
      }
    : T extends "binary"
    ? {
        options: {
          yes: BinaryOption;
          no: BinaryOption;
        };
      }
    : T extends "scale"
    ? {
        scaleRange: ScaleOption;
      }
    : never);

export type AnyQuestion =
  | Question<"binary">
  | Question<"multiple">
  | Question<"scale">;

export interface SavedAnswerType {
  questionId: number;
  answer: "yes" | "no" | string[] | number;
}

export interface SaveAnswerRequest {
  answers: SavedAnswerType[] | null;
}

export interface SaveAnswerResponse {
  answers: SavedAnswerType[];
}

export interface GetSavedAnswersResponse {
  answers: SavedAnswerType[];
}

export interface SubmitRequest {
  answers: Array<SavedAnswerType & { score: number }>;
}

export interface SubmitResponse {
  totalScore: number;
  type: InvestType;
}

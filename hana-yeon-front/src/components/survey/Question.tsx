/** @jsxImportSource @emotion/react */
import { useCallback } from "react";
import { Checkbox, Flex, Slider, Spacing, Text, Top } from "tosslib";
// types
import type { Question, AnswerType } from "@/types";
// utils
import { themeStore } from "@/store/themeStore";
import { calculateMultipleAnswerScore } from "@/lib";
// components
import { BinaryOption } from "./BinaryOption";
import { Skeleton } from "./Skeleton";

interface BinaryQuestionProps {
  question: Question<"binary">;
  currentAnswer: {
    questionId: number;
    answer: AnswerType;
    score: number;
  } | null;
  onAnswerChange: (
    questionId: number,
    answer: "yes" | "no",
    score: number
  ) => void;
}

export function BinaryQuestion({
  question,
  currentAnswer,
  onAnswerChange,
}: BinaryQuestionProps) {
  const selectedValue = currentAnswer?.answer;

  const handleSelectYes = useCallback(() => {
    onAnswerChange(question.id, "yes", question.options.yes.score);
  }, [onAnswerChange, question]);

  const handleSelectNo = useCallback(() => {
    onAnswerChange(question.id, "no", question.options.no.score);
  }, [onAnswerChange, question]);

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph className="text-gray-400 dark:text-gray-300">
            {question.question}
          </Top.TitleParagraph>
        }
      />
      <div className="px-6">
        <Flex direction="column" gap={16}>
          <BinaryOption
            isSelected={selectedValue === "yes"}
            optionText={question.options.yes.label}
            handleSelect={handleSelectYes}
          />
          <BinaryOption
            isSelected={selectedValue === "no"}
            optionText={question.options.no.label}
            handleSelect={handleSelectNo}
          />
        </Flex>
      </div>
    </>
  );
}

export function MultipleQuestion({
  question,
  currentAnswer,
  onAnswerChange,
}: {
  question: Question<"multiple">;
  currentAnswer: {
    questionId: number;
    answer: AnswerType;
    score: number;
  } | null;
  onAnswerChange: (questionId: number, answer: string[], score: number) => void;
}) {
  const { theme } = themeStore();
  const selectedLabels = Array.isArray(currentAnswer?.answer)
    ? currentAnswer.answer
    : [];

  const handleMultipleOptionToggle = (label: string) => {
    const selectedLabelsSet = new Set(selectedLabels);
    const isSelected = selectedLabelsSet.has(label);

    if (isSelected) {
      selectedLabelsSet.delete(label);
    } else if (selectedLabelsSet.size < question.maxSelect) {
      selectedLabelsSet.add(label);
    } else {
      return;
    }

    const newSelection = Array.from(selectedLabelsSet);
    const score = calculateMultipleAnswerScore(question, newSelection);

    onAnswerChange(question.id, newSelection, score);
  };

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph className="text-gray-400 dark:text-gray-300">
            {question.question}
          </Top.TitleParagraph>
        }
        subtitle={
          <Top.SubTitleParagraph className="text-muted-foreground">
            복수 선택 가능 (최대 {question.maxSelect}개)
          </Top.SubTitleParagraph>
        }
      />
      <div className="px-6">
        <Flex direction="column" gap={16}>
          {question.options.map(({ label }) => (
            <div
              key={label}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleMultipleOptionToggle(label)}
            >
              <Checkbox.Line
                checked={selectedLabels.includes(label)}
                readOnly
              />
              <Text fontSize={14} color={theme === "dark" ? "white" : "black"}>
                {label}
              </Text>
            </div>
          ))}
        </Flex>
      </div>
    </>
  );
}

export function ScaleQuestion({
  question,
  currentAnswer,
  onAnswerChange,
}: {
  question: Question<"scale">;
  currentAnswer: {
    questionId: number;
    answer: AnswerType;
    score: number;
  } | null;
  onAnswerChange: (questionId: number, answer: number, score: number) => void;
}) {
  const { min, max, minLabel, maxLabel } = question.scaleRange;

  const currentValue = (currentAnswer?.answer as number) ?? min;

  const handleChange = (value: number) => {
    const score = value * question.scaleRange.scoreUnit;
    onAnswerChange(question.id, value, score);
  };

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph className="text-gray-400 dark:text-gray-300">
            {question.question}
          </Top.TitleParagraph>
        }
      />
      <div className="px-6">
        <Slider
          minValue={min}
          maxValue={max}
          value={currentValue}
          onValueChange={handleChange}
          label={{
            min: minLabel,
            max: maxLabel,
          }}
        />
      </div>
    </>
  );
}

export function QuestionSkeleton() {
  return (
    <>
      <Skeleton.ProgressBar />
      <Spacing size={24} />
      <Skeleton.Question />
    </>
  );
}

export default Object.assign(
  {},
  {
    Binary: BinaryQuestion,
    Multiple: MultipleQuestion,
    Scale: ScaleQuestion,
    Skeleton: QuestionSkeleton,
  }
);

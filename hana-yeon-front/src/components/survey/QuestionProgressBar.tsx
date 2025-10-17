import { ProgressBar } from "tosslib";
// hooks
import { useQuestionContext } from "@/hooks";
import { getInvestTypeText } from "@/lib";

export function QuestionProgressBar() {
  const { totalScore } = useQuestionContext();

  const progressPercentage = Math.round((totalScore / 20) * 100);
  const percentage = progressPercentage >= 100 ? 1 : progressPercentage / 100;

  return (
    <div className="p-4 bg-transparent">
      <ProgressBar
        progress={percentage}
        size="light"
        topAddon={
          <ProgressBar.Row>
            <ProgressBar.Label>현재 점수: {totalScore}점</ProgressBar.Label>
            <ProgressBar.Value>
              {getInvestTypeText(totalScore)}
            </ProgressBar.Value>
          </ProgressBar.Row>
        }
      />
    </div>
  );
}

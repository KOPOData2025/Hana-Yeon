// provider
import { QuestionContextProvider } from "@/provider/QuestionContextProvider";
// components
import { QuestionPageContent } from "@/components/survey/QuestionContent";

export default function SurveyPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] dark:bg-darkCard touch-pan-y">
      <QuestionContextProvider>
        <QuestionPageContent />
      </QuestionContextProvider>
    </div>
  );
}

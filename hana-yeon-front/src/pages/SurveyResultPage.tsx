// provider
import { QuestionContextProvider } from "@/provider/QuestionContextProvider";
// components
import { Spacing } from "tosslib";
import { ResultPageHeader } from "@/components/survey/ResultPageHeader";
import { ResultPageContent } from "@/components/survey/ResultPageContent";

export default function SurveyResultPage() {
  return (
    <QuestionContextProvider>
      <ResultPageHeader />
      <Spacing size={24} />
      <ResultPageContent />
      <Spacing size={16} />
    </QuestionContextProvider>
  );
}

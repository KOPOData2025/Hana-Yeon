import { useContext } from "react";
import { QuestionContext } from "@/provider/QuestionContextProvider";

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error(
      "useQuestionContext must be used within a QuestionContextProvider"
    );
  }
  return context;
};

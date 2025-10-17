import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib";
import { GET_TODAY_QUIZ, CHECK_QUIZ_ANSWER } from "@/constants";
import type {
  ApiResponse,
  TodayQuizResponse,
  CheckQuizRequest,
  CheckQuizResponse,
} from "@/types";

export const useGetTodayQuiz = () => {
  return useQuery({
    queryKey: ["getTodayQuiz"],
    queryFn: () => {
      return API.get<ApiResponse<TodayQuizResponse>>(GET_TODAY_QUIZ);
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useCheckQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckQuizRequest) => {
      const res = await API.post<ApiResponse<CheckQuizResponse>>(
        CHECK_QUIZ_ANSWER,
        data
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
      queryClient.invalidateQueries({ queryKey: ["getTodayQuiz"] });
    },
  });
};

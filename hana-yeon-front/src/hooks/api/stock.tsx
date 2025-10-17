import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib";
import { POST_INVEST_TYPE } from "@/constants";
import type { PostInvestTypeRequest, PostInvestTypeResponse } from "@/types";

export const usePostInvestType = () => {
  return useMutation({
    mutationFn: async (data: PostInvestTypeRequest) => {
      const res = await API.post(POST_INVEST_TYPE, data);
      return res;
    },
  });
};

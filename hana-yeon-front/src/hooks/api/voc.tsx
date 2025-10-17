import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib";
import { POST_VOC } from "@/constants";
import type { VocRequest, VocResponse } from "@/types";

export const usePostVoc = () => {
  return useMutation({
    mutationFn: async (data: VocRequest) => {
      const res = await API.post<VocResponse>(POST_VOC, data);
      return res;
    },
  });
};

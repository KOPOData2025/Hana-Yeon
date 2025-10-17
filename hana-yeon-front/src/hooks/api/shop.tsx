import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib";
import { BUY_PRODUCT } from "@/constants";
import type { BuyProductRequest, BuyProductResponse } from "@/types";

export const useBuyProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BuyProductRequest) => {
      const res = await API.post<BuyProductResponse>(BUY_PRODUCT, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
    },
  });
};

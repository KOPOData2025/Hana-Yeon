import { useSuspenseQuery } from "@tanstack/react-query";
// constants
import { GET_ALL_INSURANCE } from "@/constants/endPoint";
// types
import type { ApiResponse, GetAllInsuranceResponse } from "@/types";
// utils
import { API } from "@/lib/fetcher";

export const useGetAllInsurance = () => {
  return useSuspenseQuery({
    queryKey: ["getAllInsurance"],
    queryFn: () => {
      return API.get<ApiResponse<GetAllInsuranceResponse>>(GET_ALL_INSURANCE);
    },
    staleTime: 1000 * 60 * 1, // 1분간 캐시 유지
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// constants
import {
  SEARCH_ALL_ASSETS,
  REGISTER_ACCOUNT,
  REGISTER_INSURANCE,
  GET_PORTFOLIO,
} from "@/constants/endPoint";
// types
import type {
  AssetSearchResponse,
  ApiResponse,
  RegisterAccountRequest,
  RegisterAccountResponse,
  RegisterInsuranceRequest,
  RegisterInsuranceResponse,
  PortfolioResponse,
} from "@/types";
// utils
import { API } from "@/lib/fetcher";

export const useSearchAllAssets = () => {
  return useQuery<ApiResponse<AssetSearchResponse>>({
    queryKey: ["searchAllAssets"],
    queryFn: () => {
      return API.get<ApiResponse<AssetSearchResponse>>(SEARCH_ALL_ASSETS);
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useRegisterAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterAccountRequest) => {
      return API.post<RegisterAccountResponse>(REGISTER_ACCOUNT, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAccount"] });
      queryClient.invalidateQueries({ queryKey: ["getPensionAccount"] });
    },
  });
};

export const useRegisterInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterInsuranceRequest) => {
      return API.post<RegisterInsuranceResponse>(REGISTER_INSURANCE, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInsurance"] });
    },
  });
};

export const useGetPortfolio = () => {
  return useQuery<ApiResponse<PortfolioResponse>>({
    queryKey: ["getPortfolio"],
    queryFn: () => {
      return API.get<ApiResponse<PortfolioResponse>>(GET_PORTFOLIO);
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

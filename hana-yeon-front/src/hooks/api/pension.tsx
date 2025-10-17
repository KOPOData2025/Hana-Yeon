import { useQuery } from "@tanstack/react-query";
// constants
import {
  GET_PEER_AVERAGE,
  GET_PEER_MONTHLY_AVERAGE,
  GET_PREDICT_NATIONAL_PENSION,
  INFLATION_RATE,
} from "@/constants";
// types
import type {
  ApiResponse,
  GetPeerAverageResponse,
  GetPeerMonthlyAverageResponse,
  GetPredictNationalPensionResponse,
} from "@/types";
// utils
import { API, delay } from "@/lib";

export const useGetPeerAverage = (age: number) => {
  return useQuery({
    queryKey: ["getPeerAverage", age],
    queryFn: async () => {
      const res = await API.get<ApiResponse<GetPeerAverageResponse>>(
        GET_PEER_AVERAGE(age)
      );
      return res;
    },
    select: (data) => {
      const currentYear = new Date().getFullYear();
      const yearDiff = currentYear - parseInt(data?.data.dataYear);

      // 물가 상승률
      const inflationMultiplier = Math.pow(1 + INFLATION_RATE, yearDiff);

      return {
        ...data,
        data: {
          ...data?.data,
          nationalPension: data?.data.nationalPension,
          personalPension: data?.data.personalPension * inflationMultiplier,
          retirementPension: data?.data.retirementPension * inflationMultiplier,
          averageTotalPension:
            data?.data.averageTotalPension * inflationMultiplier,
        },
      };
    },
    enabled: !!age,
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
  });
};

export const useGetPeerMonthlyAverage = (age: number) => {
  return useQuery({
    queryKey: ["getPeerMonthlyAverage", age],
    queryFn: () => {
      return API.get<ApiResponse<GetPeerMonthlyAverageResponse>>(
        GET_PEER_MONTHLY_AVERAGE(age)
      );
    },
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    enabled: !!age,
  });
};

export const useGetPredictNationalPension = (monthlyContribution: number) => {
  return useQuery({
    queryKey: ["getPredictNationalPension", monthlyContribution],
    queryFn: async () => {
      await delay(1500);
      return API.get<ApiResponse<GetPredictNationalPensionResponse>>(
        GET_PREDICT_NATIONAL_PENSION(monthlyContribution)
      );
    },
    enabled: false,
    staleTime: 0,
  });
};

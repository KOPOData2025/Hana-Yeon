import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib";
import type { UpbitAccount, UpbitUser, VirtualCurrencyResponse } from "@/types";
import {
  GET_VIRTUAL_CURRENCY,
  GET_UPBIT_USER,
  REGISTER_UPBIT_KEYS,
} from "@/constants";

export const useGetVirtualCurrency = () => {
  return useQuery({
    queryKey: ["getVirtualCurrency"],
    queryFn: async () => {
      const response = await API.get<{
        requiresKeyRegistration: boolean;
        accounts?: string | UpbitAccount[];
        message?: string;
      }>(GET_VIRTUAL_CURRENCY);

      let parsedAccounts: UpbitAccount[] = [];
      if (response.accounts) {
        if (typeof response.accounts === "string") {
          try {
            parsedAccounts = JSON.parse(response.accounts);
          } catch (error) {
            console.error("Failed to parse accounts JSON:", error);
            parsedAccounts = [];
          }
        } else {
          parsedAccounts = response.accounts;
        }
      }

      return {
        requiresKeyRegistration: response.requiresKeyRegistration,
        accounts: parsedAccounts,
        message: response.message,
      } as VirtualCurrencyResponse;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetUpbitAccounts = () => {
  const { data, ...rest } = useGetVirtualCurrency();
  return {
    data: data?.accounts || [],
    requiresKeyRegistration: data?.requiresKeyRegistration || false,
    ...rest,
  };
};

export const useGetUpbitUser = () => {
  return useQuery({
    queryKey: ["getUpbitUser"],
    queryFn: async () => {
      const response = await API.get<UpbitUser>(GET_UPBIT_USER);
      return response;
    },
  });
};

export const useRegisterUpbitKeys = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accessKey,
      secretKey,
    }: {
      accessKey: string;
      secretKey: string;
    }) => {
      const response = await API.post(REGISTER_UPBIT_KEYS, {
        accessKey,
        secretKey,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getVirtualCurrency"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUpbitUser"],
      });
    },
  });
};

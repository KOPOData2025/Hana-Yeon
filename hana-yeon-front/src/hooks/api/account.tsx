import {
  useQueryClient,
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueries,
} from "@tanstack/react-query";
// constants
import {
  GET_ALL_ACCOUNTS,
  GET_ACCOUNT_DETAIL,
  SEND_MONEY,
  CREATE_PENSION_ACCOUNT,
} from "@/constants/endPoint";
// types
import type {
  ApiResponse,
  GetAllAccountsResponse,
  GetAccountTransactionResponse,
  GetAccountDetailResponse,
  SendMoneyRequestBody,
  SendMoneyResponse,
  CreatePensionAccountRequest,
  CreatePensionAccountResponse,
} from "@/types";
// utils
import { API, delay } from "@/lib";

export const useGetAllAccount = () => {
  return useQuery({
    queryKey: ["getAllAccount"],
    queryFn: () => {
      return API.get<ApiResponse<GetAllAccountsResponse>>(GET_ALL_ACCOUNTS);
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useGetAccountTransaction = (accountNum: string) => {
  return useQuery({
    queryKey: ["getAccountTransaction", accountNum],
    queryFn: () => {
      return API.get<ApiResponse<GetAccountTransactionResponse>>(
        GET_ACCOUNT_DETAIL(accountNum)
      );
    },
    staleTime: 0,
  });
};

export const useGetPensionAccount = () => {
  return useSuspenseQuery({
    queryKey: ["getPensionAccount"],
    queryFn: () => {
      const res =
        API.get<ApiResponse<GetAllAccountsResponse>>(GET_ALL_ACCOUNTS);
      return res;
    },
    select: ({ data }) => {
      return data?.filter(
        ({ accountType }) =>
          accountType.includes("PENSION") ||
          accountType.includes("IRP") ||
          accountType.includes("RETIREMENT")
      );
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useGetAccountDetailQueries = (accountNums: string[]) => {
  return useQueries({
    queries: accountNums.map((accountNum) => ({
      queryKey: ["pensionAccountDetail", accountNum],
      queryFn: () => {
        const response = API.get<ApiResponse<GetAccountDetailResponse>>(
          GET_ACCOUNT_DETAIL(accountNum)
        );
        return response;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });
};

export const useGetAccountDetailQuery = (accountNum: string) => {
  return useQuery({
    queryKey: ["getAccountDetail", accountNum],
    queryFn: async () => {
      await delay(500);
      const data = await API.get<ApiResponse<GetAccountDetailResponse>>(
        GET_ACCOUNT_DETAIL(accountNum)
      );
      return data;
    },
    enabled: !!accountNum,
  });
};

export const useSendMoneyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["sendMoney"],
    mutationFn: async (body: SendMoneyRequestBody) => {
      const data = await API.post<SendMoneyResponse, typeof body>(
        SEND_MONEY,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAccount"] });
      queryClient.invalidateQueries({ queryKey: ["getAccountDetail"] });
    },
  });
};

export const useMakePensionAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["makePensionAccount"],
    mutationFn: async (body: CreatePensionAccountRequest) => {
      const data = await API.post<
        ApiResponse<CreatePensionAccountResponse>,
        typeof body
      >(CREATE_PENSION_ACCOUNT, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAccount"] });
      queryClient.invalidateQueries({ queryKey: ["getPensionAccount"] });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
// constants
import {
  LOGIN,
  LOGOUT,
  SIGNUP,
  GET_ME,
  publicRoutes,
  SEND_SMS,
  CERTIFY_USER_CI,
} from "@/constants";
// utils
import { API, API_EXTERNAL } from "@/lib/fetcher";
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  GetMeResponse,
  ApiResponse,
  SendSmsRequest,
  SendSmsResponse,
  CertifyUserCiRequest,
  CertifyUserCiResponse,
  LogoutResponse,
} from "@/types";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpRequest) => {
      const res = await API.post<SignUpResponse>(SIGNUP, data);
      return res;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: SignInRequest) => {
      const res = await API.post<SignInResponse>(LOGIN, data);
      return res;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await API.post<LogoutResponse>(LOGOUT);
      return res;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useGetMe = () => {
  const location = useLocation();

  return useQuery({
    queryKey: ["getMe"],
    queryFn: async () => {
      const res = await API.get<ApiResponse<GetMeResponse>>(GET_ME);
      return res?.data;
    },
    enabled: !publicRoutes.includes(location.pathname),
    staleTime: 1000 * 60 * 20, // 20분간 캐시 유지
  });
};

export const useSendSms = () => {
  return useMutation({
    mutationFn: async (data: SendSmsRequest) => {
      const res = await API_EXTERNAL.post<SendSmsResponse>(SEND_SMS, data);
      return res;
    },
  });
};

export const useCertifyUserCi = () => {
  return useMutation({
    mutationFn: async (data: CertifyUserCiRequest) => {
      const res = await API_EXTERNAL.post<CertifyUserCiResponse>(
        CERTIFY_USER_CI,
        data
      );
      return res;
    },
  });
};

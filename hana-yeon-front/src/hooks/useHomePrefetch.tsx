import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  GET_ALL_ACCOUNTS,
  GET_ALL_INSURANCE,
  GET_VIRTUAL_CURRENCY,
  PATH,
} from "@/constants";
import { API } from "@/lib";
import { UpbitWebSocketManager } from "./useUpbitSocket";
import type { UpbitAccount, VirtualCurrencyResponse } from "@/types";

export const useHomePrefetch = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      await queryClient.prefetchQuery({
        queryKey: ["getPensionAccount"],
        queryFn: () => API.get(GET_ALL_ACCOUNTS),
        staleTime: 1000 * 60 * 5,
      });

      const virtualCurrencyPromise = queryClient.prefetchQuery({
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
      });

      queryClient.prefetchQuery({
        queryKey: ["getAllInsurance"],
        queryFn: () => API.get(GET_ALL_INSURANCE),
        staleTime: 1000 * 60 * 5,
      });

      import("@/pages/PensionPage");
      import("@/pages/AIchatPage");
      import("@/pages/InsurancePage");
      import("@/pages/VirtualCurrencyPage");

      await virtualCurrencyPromise;
      const virtualCurrencyData =
        queryClient.getQueryData<VirtualCurrencyResponse>([
          "getVirtualCurrency",
        ]);

      if (virtualCurrencyData?.accounts) {
        const assets = virtualCurrencyData.accounts;
        const codes = (Array.isArray(assets) ? assets : [])
          .filter((asset) => asset.currency !== "KRW")
          .map((asset) => `${asset.unit_currency}-${asset.currency}`);

        if (codes.length > 0) {
          console.log("Pre-connecting Upbit WebSocket with codes:", codes);
          UpbitWebSocketManager.getInstance().connect(codes);
        }
      }
    };

    if (window.location.pathname === PATH.HOME) {
      prefetchData();
    }
  }, [queryClient]);
};

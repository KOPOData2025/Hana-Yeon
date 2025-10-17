import { useState } from "react";
import { useGetVirtualCurrency } from "@/hooks/api";
import VirtualCurrencyMain from "@/components/vitualCurrency/VirtualCurrencyMain";
import UpbitKeyManager from "@/components/vitualCurrency/UpbitKeyManager";

export default function VirtualCurrencyPage() {
  const {
    data: virtualCurrencyData,
    isLoading,
    isError,
    refetch,
  } = useGetVirtualCurrency();
  const [keyRegistrationCompleted, setKeyRegistrationCompleted] =
    useState(false);

  const handleKeyRegistered = () => {
    setKeyRegistrationCompleted(true);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">가상화폐 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // API 키 등록이 필요한 경우
  if (
    isError ||
    (virtualCurrencyData?.requiresKeyRegistration && !keyRegistrationCompleted)
  ) {
    return <UpbitKeyManager onKeyRegistered={handleKeyRegistered} />;
  }

  // API 키가 등록되어 있는 경우
  return <VirtualCurrencyMain />;
}

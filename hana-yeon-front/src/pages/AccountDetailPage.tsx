import { useState } from "react";
import {
  RefreshCw,
  Settings,
  Search,
  ChevronDown,
  Star,
  Copy,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
// api
import { useGetAccountDetailQuery, useGetAllAccount } from "@/hooks/api";
// libs
import {
  copyToClipboard,
  formatBalance,
  formatDateToMD,
  formatTimeToHHMM,
} from "@/lib";
// constants
import { BANK_COLORS, BANK_IMAGE_MAP, PATH } from "@/constants";
// components
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import FillAccountDrawer from "@/components/sendMoney/FillAccountDrawer";

export default function AccountDetail() {
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useInternalRouter();
  const { accountNum } = useParams();
  const { state } = useLocation();
  const { bankCodeStd, fintechUseNum } = state;

  if (!accountNum || !bankCodeStd || !fintechUseNum) {
    router.push(PATH.HOME);
    return;
  }

  const { data: allAccountRes } = useGetAllAccount();
  const {
    data: response,
    refetch,
    isLoading,
  } = useGetAccountDetailQuery(accountNum);

  const isMainAccount = allAccountRes?.data?.find(
    (account) => account.accountNum === accountNum
  )?.isMainAccount;

  const data = response?.data;
  const bankColor = BANK_COLORS[bankCodeStd as keyof typeof BANK_COLORS];

  const formatAmount = (type: string, amount: number) => {
    const formattedAmount = formatBalance(amount);
    return type === "입금" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const getAmountColor = (type: string) => {
    return type === "입금"
      ? "text-primary"
      : "text-gray-600 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen pb-32 bg-dark-background">
      <div>
        <div className="flex items-center justify-end px-4 pb-3">
          <div className="flex items-center gap-2">
            <button
              className="p-2"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="w-5 h-5 text-dark-main-text" />
            </button>
            <button className="p-2">
              <Settings className="w-5 h-5 text-dark-main-text" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 pb-6">
        <Card
          className={`${bankColor.text} border-0 shadow-lg`}
          style={{ backgroundColor: bankColor.primary }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={BANK_IMAGE_MAP.get(bankCodeStd)}
                    alt={bankCodeStd}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm opacity-90">{data?.bankName}</p>
                  <p className="text-xs w-36 truncate">{data?.productName}</p>
                </div>
              </div>

              {/* 주계좌 설정 버튼 */}
              <div className="flex items-center">
                {isMainAccount ? (
                  <div className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-medium">주계좌</span>
                  </div>
                ) : (
                  <button className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors disabled:opacity-50">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-medium">주계좌 설정</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm opacity-90 mb-1">{accountNum}</p>
                <Copy
                  className="w-4 h-4 opacity-70 cursor-pointer mb-1"
                  onClick={() => copyToClipboard(accountNum)}
                />
              </div>
              <p className="text-3xl font-bold mb-2">
                {formatBalance(Number(data?.balanceAmt) || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-dark-main-text"
              onClick={() =>
                setSelectedFilter(selectedFilter === "전체" ? "입금" : "전체")
              }
            >
              {selectedFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2">
            <Search className="w-5 h-5 text-dark-main-text" />
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh/3)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-olo"></div>
        </div>
      ) : (
        <div>
          {data?.resList.map((transaction, index) => (
            <div key={`${transaction.tranDate}-${index}`} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1">
                  <div className="flex flex-col w-1/6">
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDateToMD(transaction.tranDate)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {transaction.printContent}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTimeToHHMM(transaction.tranTime)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col">
                    <div
                      className={`font-semibold ${getAmountColor(
                        transaction.inoutType
                      )}`}
                    >
                      {formatAmount(
                        transaction.inoutType,
                        Number(transaction.tranAmt)
                      )}
                    </div>
                    <div className="text-sm dark:text-gray-400">
                      {formatBalance(Number(transaction.afterBalanceAmt))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* 하단 고정 버튼 영역 */}
      <div className="fixed max-w-md w-full bottom-8 px-4 pb-6 pt-3 z-10 flex gap-3">
        <Button
          className="flex-1 h-14 border border-gray-400 bg-gray-300 text-gray-700 rounded-xl text-lg font-semibold"
          onClick={() => setIsDrawerOpen(true)}
        >
          채우기
        </Button>
        <Button
          className="flex-1 h-14 bg-primary text-white rounded-xl text-lg font-semibold"
          onClick={() =>
            router.push(PATH.SEND_MONEY, {
              state: {
                selfBankCode: bankCodeStd,
                selfAccount: accountNum,
              },
            })
          }
        >
          보내기
        </Button>
      </div>

      {/* Account Drawer */}
      {allAccountRes && accountNum && (
        <FillAccountDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          allAccountData={allAccountRes?.data}
          opponentAccount={accountNum}
          opponentBankCode={bankCodeStd}
        />
      )}
    </div>
  );
}

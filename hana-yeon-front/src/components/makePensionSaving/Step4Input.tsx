import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Loader2 } from "lucide-react";
import RangeInput from "@/components/ui/RangeInput";
import PensionMyAccountDrawer from "./PensionMyAccountDrawer";
import type { GetAllAccountsResponse } from "@/types";
import { useGetAllAccount, useMakePensionAccountMutation } from "@/hooks/api";
import { useRegisterAccount } from "@/hooks/api/asset";
import { Spacing } from "tosslib";
import { enqueueSnackbar } from "notistack";
interface Step4InputProps {
  history: any;
  context: any;
}

export default function Step4Input({ history, context }: Step4InputProps) {
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [receivingAge, setReceivingAge] = useState(55);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedAccountInfo, setSelectedAccountInfo] = useState<{
    bankName: string;
    accountNum: string;
    productName: string;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data } = useGetAllAccount();
  const { mutateAsync: makePensionAccountMutation, isPending: makePending } =
    useMakePensionAccountMutation();
  const { mutateAsync: registerAccountMutation, isPending: registerPending } =
    useRegisterAccount();

  const allAccountData = data?.data ?? ([] as GetAllAccountsResponse);
  const isLoading = makePending || registerPending;

  const handleAccountSelect = (accountNum: string) => {
    setSelectedAccount(accountNum);
    const account = allAccountData?.find(
      (acc) => acc.accountNum === accountNum
    );
    if (account) {
      setSelectedAccountInfo({
        bankName: account.bankName,
        accountNum: account.accountNum,
        productName: account.productName,
      });
    }
  };

  const handleContinue = async () => {
    if (!selectedAccount) {
      alert("연금 수령 계좌를 선택해 주세요.");
      return;
    }

    try {
      const createAccountResponse = await makePensionAccountMutation({
        productName: "행복knowhow연금저축계좌(집합투자증권)",
        accountType: "PENSION_FUND",
        returnRate: 5.2,
        riskLevel: 3,
      });

      if (!createAccountResponse?.data) {
        throw new Error("계좌 생성에 실패했습니다.");
      }

      const createdAccount = createAccountResponse.data;

      await registerAccountMutation({
        accountList: [
          {
            bankcode: createdAccount.bankCodeStd,
            bankName: createdAccount.bankName,
            productName: createdAccount.productName,
            productSubName: "",
            accountType: "PENSION_FUND",
            accountNum: createdAccount.accountNum,
            accountSeq: "01",
            accountIssueDate: createdAccount.accountIssueDate,
            lastTranDate: createdAccount.accountIssueDate,
            dormancyYn: "N",
          },
        ],
      });

      history.push("complete", {
        ...context,
        receivingAge,
        pensionReceiveAccount: selectedAccount,
        accountName: "행복knowhow연금저축계좌(집합투자증권)",
        createdAccountNum: createdAccount.accountNum,
      });
    } catch (error) {
      enqueueSnackbar("계좌 생성 중 오류가 발생했습니다. 다시 시도해주세요.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-darkBg">
      <Spacing size={24} />

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl px-6 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              ⓘ 원금손실가능상품
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-base text-gray-700 dark:text-gray-200">
              연금저축 잔여한도
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              18,000,000원
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-darkCard rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            연간 납입한도
          </h3>
          <div className="mb-4">
            <button className="text-olo font-semibold border-b-2 border-olo pb-1">
              {monthlyContribution === 0 ? 5 : monthlyContribution}만원 이상
            </button>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              설정하기
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최소 납입 금액은 5만원 이상입니다
          </p>

          <div className="flex items-center justify-between mt-5 text-[13px] -mx-4">
            {[5, 10, 100, 500, 1000].map((val, index) => (
              <div
                key={index}
                className="text-white font-semibold bg-olo dark:bg-olo/80 rounded-sm p-2"
                role="button"
                onClick={() => setMonthlyContribution(val)}
              >
                <span>{val}만원</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-darkCard rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            연금을 어떻게 받을까요?
          </h3>
          <div>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-700 dark:text-gray-300">
                  만
                </span>
                <span className="text-2xl font-bold text-olo">
                  {receivingAge}
                </span>
                <span className="text-base text-gray-700 dark:text-gray-300">
                  세부터 매월 받기
                </span>
              </div>
            </div>
          </div>
          <RangeInput
            value={receivingAge}
            onChange={setReceivingAge}
            id="receiving-age"
            min={55}
            max={100}
            showLabel={false}
          />

          <Spacing size={24} />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            연금수령계좌
          </h3>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full flex items-center justify-between px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer bg-transparent"
          >
            {selectedAccountInfo ? (
              <div className="flex flex-col items-start">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {selectedAccountInfo.bankName}
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {selectedAccountInfo.productName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAccountInfo.accountNum}
                </span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                계좌 선택
              </span>
            )}
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-darkBg"
      >
        <button
          onClick={handleContinue}
          disabled={
            !monthlyContribution ||
            !receivingAge ||
            !selectedAccount ||
            isLoading
          }
          className="w-full bg-olo disabled:bg-olo/40 disabled:text-gray-500 text-white font-semibold py-4 rounded-xl transition-colors border-none cursor-pointer text-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              계좌 생성 중...
            </>
          ) : (
            "가입하기"
          )}
        </button>
      </motion.div>

      {/* 계좌 선택 Drawer */}
      <PensionMyAccountDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        allAccountData={allAccountData}
        onSelectAccount={handleAccountSelect}
      />
    </div>
  );
}

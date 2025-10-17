import { useCallback, useState, useMemo } from "react";
import { motion } from "motion/react";
import { Calculator } from "lucide-react";
// types
import type { AccountDto } from "@/types";
// constants
import { BANK_IMAGE_MAP } from "@/constants";
// components
import PensionInputForm from "./PensionInputForm";
import PredictNationalPensionModal from "./PredictNationalPensionModal";
import { GlobalPortal } from "tosslib";
import { useAuthStore } from "@/store";

export interface IPensionData {
  personalPensions: Record<
    string,
    {
      returnRate: number;
      period: number;
      predictAmount: number;
      currentAmount: number;
      endAge: number;
    }
  >;
  retirementPension: {
    contribution: number;
    balance: number;
    returnRate: number;
    period: number;
    endAge: number;
  };
}

interface IPensionContribution {
  returnRate: number;
  period: number;
  predictAmount: number;
  currentAmount: number;
  endAge: number;
}

interface Step3PensionInfoProps {
  nationalPensionInput: string;
  onNationalPensionInputChange: (value: string) => void;
  onNext: (pensionInputData: IPensionData) => void;
  userPensionData: AccountDto[];
}

export default function Step3PensionInfo({
  nationalPensionInput,
  onNationalPensionInputChange,
  onNext,
  userPensionData,
}: Step3PensionInfoProps) {
  const { userInfo } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const [retirementPensionContribution, setRetirementPensionContribution] =
    useState(0);
  const [retirementPensionEndAge, setRetirementPensionEndAge] = useState(0);
  const [personalPensionContributions, setPersonalPensionContributions] =
    useState<Record<string, IPensionContribution>>({});

  const userCurrentAge = userInfo?.age ?? 30;
  const irpMaxContributeAge = 55;
  const personalPensionMaxContributeAge = 55;

  const pensionAccounts = useMemo(() => {
    const pensionTypes = [
      "PENSION_FUND",
      "PENSION_TRUST",
      "PENSION_INSURANCE",
      "IRP",
    ];
    return userPensionData.filter((account) =>
      pensionTypes.includes(account.accountType)
    );
  }, [userPensionData]);

  const personalPensionAccounts = useMemo(() => {
    return pensionAccounts.filter((account) =>
      ["PENSION_FUND", "PENSION_TRUST", "PENSION_INSURANCE"].includes(
        account.accountType
      )
    );
  }, [pensionAccounts]);

  const retirementPensionAccounts = useMemo(() => {
    return pensionAccounts.filter(
      ({ accountType }) =>
        accountType.includes("IRP") || accountType.includes("RETIREMENT")
    );
  }, [pensionAccounts]);

  const retirementPensionData = useMemo(() => {
    const totalBalance = retirementPensionAccounts.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmt || "0"),
      0
    );
    const avgReturnRate =
      retirementPensionAccounts.length > 0
        ? retirementPensionAccounts.reduce(
            (sum, account) => sum + (account.returnRate || 0),
            0
          ) / retirementPensionAccounts.length
        : 0;

    const currentYear = new Date().getFullYear();
    const avgPeriodYears =
      retirementPensionAccounts.length > 0
        ? Math.round(
            retirementPensionAccounts.reduce((sum, account) => {
              if (account.accountIssueDate) {
                const issueYear = new Date(
                  account.accountIssueDate
                ).getFullYear();
                return sum + (currentYear - issueYear);
              }
              return sum;
            }, 0) / retirementPensionAccounts.length
          )
        : 0;

    return {
      balance: totalBalance,
      returnRate: avgReturnRate,
      periodYears: avgPeriodYears,
      accounts: retirementPensionAccounts,
      defaultEndAge: Math.min(userCurrentAge + 20, irpMaxContributeAge),
    };
  }, [retirementPensionAccounts, userCurrentAge, irpMaxContributeAge]);

  const handleChangeNationalPensionInput = useCallback(
    (value: string) => {
      onNationalPensionInputChange(value);
    },
    [onNationalPensionInputChange]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onSelect = useCallback(
    (amount: number) => {
      closeModal();
      onNationalPensionInputChange(amount.toString());
    },
    [closeModal, onNationalPensionInputChange]
  );

  const handlePersonalPensionContributionChange = useCallback(
    (
      accountNum: string,
      returnRate: number,
      period: number,
      predictAmount: number,
      currentAmount: number,
      endAge: number
    ) => {
      setPersonalPensionContributions((prev) => ({
        ...prev,
        [accountNum]: {
          returnRate,
          period,
          predictAmount,
          currentAmount,
          endAge,
        },
      }));
    },
    []
  );

  const handleRetirementPensionContributionChange = useCallback(
    (contribution: number) => {
      setRetirementPensionContribution(contribution);
    },
    []
  );

  const handlePersonalPensionEndAgeChange = useCallback(
    (accountNum: string, endAge: number) => {
      setPersonalPensionContributions((prev) => {
        const existing = prev[accountNum];
        if (!existing) return prev;
        return {
          ...prev,
          [accountNum]: { ...existing, endAge },
        };
      });
    },
    []
  );

  const handleRetirementPensionEndAgeChange = useCallback((endAge: number) => {
    setRetirementPensionEndAge(endAge);
  }, []);

  const getPersonalPensionTypeName = (accountType: string) => {
    switch (accountType) {
      case "PENSION_FUND":
        return "연금펀드";
      case "PENSION_TRUST":
        return "연금신탁";
      case "PENSION_INSURANCE":
        return "연금보험";
      default:
        return "개인연금";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 pb-12"
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          연금 정보 확인 및 입력
        </h1>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          보유 중인 연금
        </h3>
        <div className="space-y-6">
          <PensionInputForm
            title="개인형 퇴직연금 (IRP)"
            productName={pensionAccounts[0].productName}
            iconSrc="hana3dIcon/hanaIcon3d_2_101.png"
            currentBalance={retirementPensionData.balance}
            yieldRate={retirementPensionData.returnRate}
            periodYears={retirementPensionData.periodYears}
            annualContribution={retirementPensionContribution}
            onContributionChange={handleRetirementPensionContributionChange}
            delay={0.1}
            hasAccount={retirementPensionData.accounts.length > 0}
            endAge={
              retirementPensionEndAge || retirementPensionData.defaultEndAge
            }
            onEndAgeChange={handleRetirementPensionEndAgeChange}
          />

          {personalPensionAccounts.length > 0 ? (
            personalPensionAccounts.map((account, index) => {
              const currentYear = new Date().getFullYear();
              const periodYears = account.accountIssueDate
                ? currentYear - new Date(account.accountIssueDate).getFullYear()
                : 0;

              const defaultEndAge = Math.min(
                userCurrentAge + 20,
                personalPensionMaxContributeAge
              );

              const contribution =
                personalPensionContributions[account.accountNum];
              const endAge = contribution?.endAge || defaultEndAge;

              return (
                <PensionInputForm
                  key={account.accountNum}
                  title={`${getPersonalPensionTypeName(account.accountType)} (${
                    account.productName
                  })`}
                  iconSrc={
                    BANK_IMAGE_MAP.get(account.bankCodeStd) ||
                    BANK_IMAGE_MAP.get("081") ||
                    ""
                  }
                  currentBalance={parseFloat(account.balanceAmt || "0")}
                  yieldRate={account.returnRate || 0}
                  periodYears={periodYears}
                  annualContribution={contribution?.predictAmount || 0}
                  onContributionChange={(contributionAmount) =>
                    handlePersonalPensionContributionChange(
                      account.accountNum,
                      account.returnRate || 0,
                      periodYears,
                      contributionAmount,
                      parseFloat(account.balanceAmt || "0"),
                      endAge
                    )
                  }
                  delay={0.2 + index * 0.1}
                  hasAccount={true}
                  endAge={endAge}
                  onEndAgeChange={(newEndAge) =>
                    handlePersonalPensionEndAgeChange(
                      account.accountNum,
                      newEndAge
                    )
                  }
                />
              );
            })
          ) : (
            <PensionInputForm
              title="개인연금 (연금저축)"
              iconSrc="hana3dIcon/hanaIcon3d_4_65.png"
              currentBalance={0}
              yieldRate={0}
              periodYears={0}
              annualContribution={0}
              onContributionChange={() => {}}
              delay={0.2}
              hasAccount={false}
              endAge={personalPensionMaxContributeAge}
              onEndAgeChange={() => {}}
            />
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          국민연금
        </h3>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-darkCard rounded-xl shadow-sm p-4 border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full">
                <img src="nps.png" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  국민연금
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full border-2 border-brand text-brand py-2 rounded-lg font-medium flex items-center justify-center space-x-2 dark:border-brand dark:text-brand"
              >
                <Calculator className="w-4 h-4" />
                <span>간편 계산기로 확인하기</span>
              </button>

              <input
                type="text"
                placeholder="월 예상 수령액 입력"
                value={
                  nationalPensionInput
                    ? Number(nationalPensionInput).toLocaleString()
                    : ""
                }
                onChange={({ target: { value } }) =>
                  handleChangeNationalPensionInput(value.replace(/[^0-9]/g, ""))
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-5 py-2 bg-white dark:bg-darkCard text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const pensionInputData = {
              personalPensions: personalPensionContributions,
              retirementPension: {
                contribution: retirementPensionContribution,
                balance: retirementPensionData.balance,
                returnRate: retirementPensionData.returnRate,
                period: retirementPensionData.periodYears,
                endAge:
                  retirementPensionEndAge ||
                  retirementPensionData.defaultEndAge,
              },
            };

            onNext(pensionInputData);
          }}
          className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 bg-gradient-to-r from-brand to-brand text-white shadow-lg"
        >
          또래와 비교 분석하기
        </motion.button>
      </motion.div>
      {showModal && (
        <GlobalPortal.Consumer>
          <div className="fixed top-0 bg-background dark:bg-darkBg w-full h-full z-[9999]">
            <PredictNationalPensionModal
              goBack={closeModal}
              onSelect={onSelect}
            />
          </div>
        </GlobalPortal.Consumer>
      )}
    </>
  );
}

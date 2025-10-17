import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { formatCurrency } from "@/lib";
import RangeInput from "@/components/ui/RangeInput";
import { useAuthStore } from "@/store";
import { numberToHangulMixed } from "es-hangul";

interface PensionInputFormProps {
  title: string;
  productName?: string;
  iconSrc: string;
  currentBalance: number;
  yieldRate: number;
  periodYears: number;
  annualContribution: number;
  onContributionChange: (contribution: number) => void;
  delay?: number;
  hasAccount: boolean;
  endAge: number;
  onEndAgeChange: (endAge: number) => void;
}

export default function PensionInputForm({
  title,
  productName = "",
  iconSrc,
  currentBalance,
  yieldRate,
  periodYears,
  annualContribution,
  onContributionChange,
  delay = 0,
  hasAccount,
  endAge,
  onEndAgeChange,
}: PensionInputFormProps) {
  const { userInfo } = useAuthStore();
  const userCurrentAge = userInfo?.age || 30;
  const maxContributeAge = 65;

  const [inputValue, setInputValue] = useState(
    annualContribution ? annualContribution.toString() : ""
  );

  const handleInputChange = useCallback(
    (value: string) => {
      const numericValue = value.replace(/[^0-9]/g, "");
      setInputValue(numericValue);

      const contributionAmount = parseFloat(numericValue) || 0;
      onContributionChange(contributionAmount);
    },
    [onContributionChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-darkCard rounded-xl shadow-sm p-6 space-y-4"
    >
      <div className="flex items-center space-x-4">
        <img className="w-12 h-12" src={iconSrc} alt={title} />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {hasAccount ? (
            <div className="flex flex-col mt-2">
              <span className="text-gray-700 text-sm w-60 truncate">
                {productName}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                현재 적립금: {formatCurrency(currentBalance, " 원")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              보유 중인 연금이 없습니다
            </p>
          )}
        </div>
      </div>

      {hasAccount && (
        <>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">
                수익률
              </span>
              <p className="font-medium text-gray-900 dark:text-white">
                연 {yieldRate}%
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">
                현재 납입기간
              </span>
              <p className="font-medium text-gray-900 dark:text-white">
                {periodYears}년
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              연금 계좌에 매년 납입할 금액을 입력해 주세요
            </label>
            <input
              type="tel"
              value={inputValue ? parseInt(inputValue).toLocaleString() : ""}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-darkCard text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand text-lg"
              placeholder="예상 연 수납액 (원)"
            />
            <span className="text-olo float-right mr-2 mt-1">
              {inputValue ? numberToHangulMixed(parseInt(inputValue)) : ""}원
            </span>
          </div>

          <RangeInput
            value={endAge}
            onChange={onEndAgeChange}
            id={`endAge-${title.replace(/\s/g, "-")}`}
            min={userCurrentAge}
            max={maxContributeAge}
          />
        </>
      )}
    </motion.div>
  );
}

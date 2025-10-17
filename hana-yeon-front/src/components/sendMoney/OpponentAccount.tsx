import { useState } from "react";
// constants
import { BANK_CODE_MAP, RECENT_ACCOUNTS } from "@/constants";
// components
import Button from "@/components/ui/Button";

interface OpponentAccountProps {
  history: any;
}

export default function OpponentAccount({ history }: OpponentAccountProps) {
  const [opponentAccount, setOpponentAccount] = useState("");
  const [opponentBankCode, setOpponentBankCode] = useState("");

  const handleOpponentAccountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOpponentAccount(value);
  };

  const handleRecentAccountClick = (account: (typeof RECENT_ACCOUNTS)[0]) => {
    setOpponentAccount(account.accountNumber.replace(/-/g, ""));
    setOpponentBankCode(account.bankCode);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-6 py-5 bg-dark-background">
      <h2 className="font-bold text-2xl mt-6 mb-4 text-gray-600 dark:text-gray-300">
        어디로 돈을 보낼까요?
      </h2>
      <input
        type="tel"
        placeholder="계좌번호 입력"
        value={opponentAccount}
        onChange={handleOpponentAccountChange}
        className="text-2xl w-full border-0 border-b-2 bg-transparent border-olo/60 text-gray-600 dark:text-gray-100 placeholder-gray-400 pb-2 mb-8 outline-none focus:border-olo"
      />

      <div className="mb-2 text-gray-600 dark:text-gray-400">은행 선택</div>
      <select
        value={opponentBankCode}
        onChange={({ target: { value } }) => setOpponentBankCode(value)}
        className="w-full h-12 rounded-xl border-0 text-lg mb-2 outline-none border-none bg-white dark:bg-gray-200 text-gray-700"
      >
        <option value="">은행을 선택하세요</option>
        {Array.from(BANK_CODE_MAP.keys()).map((key) => (
          <option key={key} value={key}>
            {BANK_CODE_MAP.get(key)}
          </option>
        ))}
      </select>

      {/* 최근 보낸 계좌 섹션 */}
      <div className="my-8">
        <h3 className="text-lg font-semibold text-dark-main-text mb-4">
          최근 보낸 계좌
        </h3>

        <div className="space-y-2">
          {RECENT_ACCOUNTS.map((account, index) => (
            <div
              key={index}
              onClick={() => handleRecentAccountClick(account)}
              className="flex items-center p-4 bg-white dark:bg-gray-200 rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 mr-4 flex-shrink-0">
                <img
                  src={account.imageUrl}
                  alt={account.bankName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-gray-600 font-medium">
                  {account.bankName}
                  {/* {account.accountType} */}
                </div>
                <div className="text-gray-400 text-sm">
                  {account.accountNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="absolute left-4 right-4 bottom-6 h-16 bg-olo text-white rounded-2xl text-xl font-medium flex items-center justify-center disabled:bg-olo/80"
        disabled={!opponentAccount || !opponentBankCode}
        onClick={() =>
          history.push("setAmount", {
            opponentAccount,
            opponentBankCode,
          })
        }
      >
        다음
      </Button>
    </div>
  );
}

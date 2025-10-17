import { useState } from "react";
// libs
import { formatNumberWithComma } from "@/lib";
import { numberToHangulMixed } from "es-hangul";
// constants
import { BANK_CODE_MAP } from "@/constants";
import DialogCommon from "@/components/ui/DialogCommon";

interface AmountProps {
  history: any;
  opponentBankCode: string;
  opponentAccount: string;
}

export default function Amount({
  history,
  opponentBankCode,
  opponentAccount,
}: AmountProps) {
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-6 py-5 bg-dark-background">
      <div className="text-gray-600 dark:text-gray-200 text-base mt-6">
        {BANK_CODE_MAP.get(opponentBankCode)} 계좌({opponentAccount})로
      </div>
      <h2 className="font-bold text-2xl mt-2 mb-4 text-dark-main-text">
        얼마를 보낼까요?
      </h2>
      <input
        type="tel"
        placeholder="금액 입력"
        value={formatNumberWithComma(amount)}
        onChange={handleAmountChange}
        className="text-2xl w-full border-0 border-b-2 border-olo/60 mb-4 outline-none focus:border-primary py-2 bg-transparent text-gray-600 dark:text-gray-200 placeholder-gray-400"
      />
      <div className="text-gray-600 dark:text-gray-400 text-lg mb-8">
        {numberToHangulMixed(Number(amount))}원
      </div>
      <button
        className="absolute left-4 right-4 bottom-6 h-16 bg-primary text-white rounded-2xl text-xl font-medium flex items-center justify-center disabled:bg-olo/60"
        disabled={!amount}
        onClick={() => setShowModal(true)}
      >
        보내기
      </button>

      <DialogCommon
        open={showModal}
        title="확인해 주세요"
        btn1Text="닫기"
        btn2Text="보낼게요"
        btn1Handler={() => setShowModal(false)}
        btn2Handler={() => {
          setShowModal(false);
          history.push("send", {
            opponentBankCode,
            opponentAccount,
            amount,
          });
        }}
        type="confirm"
      >
        <span>
          {BANK_CODE_MAP.get(opponentBankCode)} 계좌({opponentAccount})로
        </span>
        <span>{numberToHangulMixed(Number(amount))}원을 보낼까요?</span>
      </DialogCommon>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// libs
import { numberToHangulMixed } from "es-hangul";
import { formatNumberWithComma } from "@/lib/util";
// constants
import { BANK_CODE_MAP, PATH } from "@/constants";
// hooks
import { useAuthStore } from "@/store/authStore";
import { useInternalRouter } from "@/hooks";
import { useSendMoneyMutation } from "@/hooks/api";
// components
import DialogCommon from "@/components/ui/DialogCommon";
import { SendMoneyResult } from "../components/sendMoney/SendMoneyResult";

export default function SendSelf() {
  const { state } = useLocation();
  const { userInfo } = useAuthStore();
  const router = useInternalRouter();
  const { selfBankCode, selfAccount, opponentAccount, opponentBankCode } =
    state || {};

  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"amount" | "send" | "result">("amount");
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendMoneyMutation, isSuccess } = useSendMoneyMutation();

  useEffect(() => {
    if (
      !selfBankCode ||
      !selfAccount ||
      !opponentAccount ||
      !opponentBankCode
    ) {
      router.push(PATH.HOME);
    }
  }, [selfBankCode, selfAccount, opponentAccount, opponentBankCode]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleSend = async () => {
    setShowModal(false);
    setStep("send");
    setLoading(true);

    try {
      const data = await sendMoneyMutation({
        tranAmt: amount,
        dpsPrintContent: "채우기",
        recvClientName: userInfo?.userName ?? "이름 모름",
        recvClientBankCode: opponentBankCode,
        recvClientAccountNum: opponentAccount,
        transferPurpose: "TR",
        wdBankCodeStd: selfBankCode,
        wdAccountNum: selfAccount,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess && step === "send") {
      setTimeout(() => {
        setLoading(false);
        setStep("result");
      }, 2000);
    }
  }, [isSuccess, step]);

  // 금액 입력 화면
  if (step === "amount") {
    return (
      <div className="relative min-h-[calc(100vh-64px)] px-6 pb-32 pt-5 bg-dark-background">
        <div className="text-gray-600 dark:text-gray-200 text-base mt-6">
          {BANK_CODE_MAP.get(opponentBankCode)} 계좌({opponentAccount})로
        </div>
        <h2 className="font-bold text-2xl mt-2 mb-4 text-dark-main-text">
          얼마를 채울까요?
        </h2>
        <input
          type="tel"
          placeholder="금액 입력"
          value={formatNumberWithComma(amount)}
          onChange={handleAmountChange}
          className="text-2xl w-full border-0 border-b-2 border-gray-600 mb-4 outline-none focus:border-primary py-2 bg-transparent text-dark-main-text placeholder-gray-400"
        />
        <div className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          {numberToHangulMixed(Number(amount))}원
        </div>
        <button
          className="absolute left-4 right-4 bottom-8 h-16 bg-primary text-white rounded-2xl text-xl font-medium flex items-center justify-center disabled:bg-olo/60"
          disabled={!amount}
          onClick={() => setShowModal(true)}
        >
          채우기
        </button>

        <DialogCommon
          open={showModal}
          title="확인해 주세요"
          btn1Text="닫기"
          btn2Text="채울게요"
          btn1Handler={() => setShowModal(false)}
          btn2Handler={handleSend}
          type="confirm"
        >
          <span>
            {BANK_CODE_MAP.get(opponentBankCode)} 계좌({opponentAccount})로
          </span>
          <span>{numberToHangulMixed(Number(amount))}원을 채울까요?</span>
        </DialogCommon>
      </div>
    );
  }

  // 송금 처리 화면
  if (step === "send") {
    return (
      <div className="relative min-h-screen px-6 pb-32 pt-5 bg-dark-background">
        {loading ? (
          <SendMoneyResult.Loading />
        ) : isSuccess ? (
          <SendMoneyResult.Success />
        ) : (
          <div>Error</div>
        )}
      </div>
    );
  }

  // 결과 화면
  if (step === "result") {
    return (
      <div className="relative min-h-screen px-6 pb-32 pt-5 bg-dark-background">
        <SendMoneyResult.Success />
      </div>
    );
  }

  return <div>Error</div>;
}

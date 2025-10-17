import { useEffect, useState } from "react";
import { SendMoneyResult } from "./SendMoneyResult";
import { useSendMoneyMutation } from "@/hooks/api";

interface SendProps {
  context: {
    selfBankCode: string;
    selfAccount: string;
    opponentBankCode: string;
    opponentAccount: string;
    amount: string;
  };
}

export default function Send({ context }: SendProps) {
  const {
    selfBankCode,
    selfAccount,
    opponentBankCode,
    opponentAccount,
    amount,
  } = context;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: sendMoneyMutation, isPending } = useSendMoneyMutation();

  const onSubmit = async () => {
    try {
      const data = await sendMoneyMutation({
        tranAmt: amount,
        dpsPrintContent: "송금",
        recvClientName: "이름 모름",
        recvClientBankCode: opponentBankCode,
        recvClientAccountNum: opponentAccount,
        transferPurpose: "TR",
        wdBankCodeStd: selfBankCode,
        wdAccountNum: selfAccount,
      });

      const { status, success, message } = data;
      if (status === 200 && success) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setErrorMessage(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-6 pt-5 bg-dark-background">
      {isPending ? (
        <SendMoneyResult.Loading />
      ) : isSuccess ? (
        <SendMoneyResult.Success />
      ) : (
        isError && <SendMoneyResult.Error errorMessage={errorMessage} />
      )}
    </div>
  );
}

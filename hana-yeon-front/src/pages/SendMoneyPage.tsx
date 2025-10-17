import { useEffect } from "react";
import { useFunnel } from "@use-funnel/browser";
import { useLocation } from "react-router-dom";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
// constants
import { PATH } from "@/constants";
// types
import type { TSendMoneyFunnelSteps } from "@/types";
// components
import Amount from "@/components/sendMoney/Amount";
import Send from "@/components/sendMoney/Send";
import OpponentAccount from "@/components/sendMoney/OpponentAccount";

const SendMoney = () => {
  const router = useInternalRouter();
  const location = useLocation();
  const { selfBankCode, selfAccount } = location.state || {};

  useEffect(() => {
    if (!selfAccount) {
      router.replace(PATH.HOME);
    }
  }, [selfAccount, router]);

  const funnel = useFunnel<TSendMoneyFunnelSteps>({
    id: "send-money-funnel-mobile",
    initial: {
      step: "setOpponentAccount",
      context: { selfBankCode, selfAccount },
    },
  });

  return (
    <funnel.Render
      setOpponentAccount={({ history }) => (
        <OpponentAccount history={history} />
      )}
      setAmount={({
        history,
        context: { opponentBankCode, opponentAccount },
      }) => (
        <Amount
          history={history}
          opponentBankCode={opponentBankCode}
          opponentAccount={opponentAccount}
        />
      )}
      send={({ context }) => <Send context={context} />}
    />
  );
};

export default SendMoney;

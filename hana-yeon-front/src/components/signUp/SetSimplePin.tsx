import { useCallback } from "react";
import { useSignUpFormContext } from "@/contexts/SignUpContext";
// types
import type { TSignUpFunnelSteps } from "@/types";
import type { UseFunnelResults } from "@use-funnel/browser";
// components
import SecureKeypad from "@/components/ui/SecureKeypad";

interface ISetSimplePinProps {
  funnel: UseFunnelResults<TSignUpFunnelSteps, Partial<Record<string, any>>>;
  pinError: boolean;
}

export default function SetSimplePin({ funnel, pinError }: ISetSimplePinProps) {
  const { setValue, watch } = useSignUpFormContext();

  const setSimplePin = useCallback(
    (password: string) => {
      setValue("simplePin", password);
    },
    [setValue]
  );

  const {
    agreeTerms1,
    agreeTerms2,
    userName,
    ssn1,
    ssn2,
    phone1,
    phone2,
    phone3,
    simplePin,
  } = watch();

  const handleSimplePinComplete = useCallback(() => {
    funnel.history.push("SetSimplePinConfirm", () => ({
      agreedTerms: [agreeTerms1, agreeTerms2],
      userName,
      ssn1,
      ssn2,
      phone: `${phone1}${phone2}${phone3}`,
      simplePin,
    }));
  }, [simplePin]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col justify-around">
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-snug mt-10">
            간편 비밀번호를
            <br />
            설정해주세요.
          </h1>
        </div>

        <div className="w-full relative">
          <SecureKeypad
            onPasswordChange={setSimplePin}
            onComplete={handleSimplePinComplete}
          />
          {pinError && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-red-500 text-base whitespace-nowrap">
              비밀번호가 일치하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

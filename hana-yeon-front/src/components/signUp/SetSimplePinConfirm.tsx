import { useCallback } from "react";
// hooks
import { useInternalRouter } from "@/hooks";
import type { UseFunnelResults } from "@use-funnel/browser";
import type { TSignUpFunnelSteps } from "@/types";
import { useSignUpFormContext } from "@/contexts/SignUpContext";
import { PATH } from "@/constants/path";
import SecureKeypad from "@/components/ui/SecureKeypad";
import { useSignUp } from "@/hooks/api";
// lib
import { getBirthDate, getGenderFromSSN } from "@/lib/util";

interface ISetSimplePinConfirmProps {
  funnel: UseFunnelResults<TSignUpFunnelSteps, Partial<Record<string, any>>>;
  setPinError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SetSimplePinConfirm({
  funnel,
  setPinError,
}: ISetSimplePinConfirmProps) {
  const { setValue, watch, getValues } = useSignUpFormContext();
  const router = useInternalRouter();
  const { mutateAsync: signUpMutation } = useSignUp();

  const {
    simplePin,
    simplePinConfirm,
    agreeTerms1,
    agreeTerms2,
    userName,
    ssn1,
    ssn2,
    userCi,
    phone1,
    phone2,
    phone3,
  } = watch();

  const setSimplePinConfirm = useCallback(
    (password: string) => {
      setValue("simplePinConfirm", password);
    },
    [setValue]
  );

  const handleSimplePinConfirmComplete = useCallback(async () => {
    if (simplePin !== simplePinConfirm) {
      setPinError(true);
      setTimeout(() => {
        setPinError(false);
      }, 2000);

      funnel.history.push("SetSimplePin", () => ({
        agreedTerms: [agreeTerms1, agreeTerms2],
        userName,
        ssn1,
        ssn2,
        userCi,
        phone: `${phone1}${phone2}${phone3}`,
        isError: true,
      }));
    } else {
      setPinError(false);

      const birthDate = getBirthDate(ssn1);
      const gender = getGenderFromSSN(ssn2);

      try {
        const { success, data } = await signUpMutation({
          userName,
          birthDate,
          gender,
          userCi,
          phoneNo: `${phone1}${phone2}${phone3}`,
          pin: simplePin,
        });

        router.replace(PATH.HOME);
      } catch (error) {
        setPinError(true);
        console.error(error);
      }
    }
  }, [simplePin, simplePinConfirm]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col justify-around">
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-snug mt-10">
            간편 비밀번호를
            <br />
            한번 더 입력해주세요.
          </h1>
        </div>

        <div className="w-full">
          <SecureKeypad
            onPasswordChange={setSimplePinConfirm}
            onComplete={handleSimplePinConfirmComplete}
          />
        </div>
      </div>
    </div>
  );
}

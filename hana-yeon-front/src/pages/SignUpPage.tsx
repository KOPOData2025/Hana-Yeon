import { useState } from "react";
import { useFunnel } from "@use-funnel/browser";
// lib
import { getSignUpCurrentStep, getSignUpStepTitle } from "@/lib";
// types
import type { TSignUpFunnelSteps } from "@/types";
// components
import CombinedInput from "@/components/signUp/CombinedInput";
import SignUpAgreeTerm from "@/components/signUp/SignUpAgreeTerm";
import SetSimplePin from "@/components/signUp/SetSimplePin";
import SetSimplePinConfirm from "@/components/signUp/SetSimplePinConfirm";
import StepProgress from "@/components/ui/StepProgress";

const SignUpPage = () => {
  const [pinError, setPinError] = useState(false);

  const funnel = useFunnel<TSignUpFunnelSteps>({
    id: "signup-funnel",
    initial: {
      step: "AgreeToTerms",
      context: {},
    },
  });

  return (
    <div className="flex w-full h-full">
      <div className="w-full flex flex-col h-full">
        <div className="px-6 pt-6 flex-shrink-0">
          <StepProgress
            currentStep={getSignUpCurrentStep(funnel.step)}
            totalSteps={3}
            stepTitle={getSignUpStepTitle(funnel.step)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <funnel.Render
            AgreeToTerms={({ history }) => {
              return <SignUpAgreeTerm history={history} />;
            }}
            CombinedInput={({ history }) => {
              return <CombinedInput history={history} />;
            }}
            SetSimplePin={() => {
              return <SetSimplePin funnel={funnel} pinError={pinError} />;
            }}
            SetSimplePinConfirm={() => {
              return (
                <SetSimplePinConfirm
                  funnel={funnel}
                  setPinError={setPinError}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

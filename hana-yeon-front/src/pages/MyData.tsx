import { useFunnel } from "@use-funnel/browser";
// types
import type { TMyDataFunnelSteps } from "@/types";
// lib
import { getMyDataCurrentStep, getMyDataStepTitle } from "@/lib";
// components
import AgreeTerms from "@/components/myData/AgreeTerms";
import FetchMyData from "@/components/myData/FetchMyData";
import ShowDataToLink from "@/components/myData/ShowDataToLink";
import Linking from "@/components/myData/Linking";
import LinkingComplete from "@/components/myData/LinkingComplete";
import MyDataUserInput from "@/components/myData/MyDataUserInput";
import StepProgress from "@/components/ui/StepProgress";

export default function MyData() {
  const funnel = useFunnel<TMyDataFunnelSteps>({
    id: "mydata-funnel",
    initial: {
      step: "agreeTerms",
      context: {},
    },
  });

  const currentStep = getMyDataCurrentStep(funnel.step);
  const curStepTitle = getMyDataStepTitle(funnel.step);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {currentStep <= 2 && (
        <div className="p-6">
          <StepProgress
            currentStep={currentStep}
            totalSteps={2}
            stepTitle={curStepTitle}
          />
        </div>
      )}

      <div className="flex-1 min-h-0">
        <funnel.Render
          agreeTerms={({ history }) => <AgreeTerms history={history} />}
          myDataUserInput={({ history }) => (
            <MyDataUserInput history={history} />
          )}
          fetchMyData={({ history }) => <FetchMyData history={history} />}
          showDataToLink={({ history, context }) => (
            <ShowDataToLink history={history} context={context} />
          )}
          linking={({ history, context }) => (
            <Linking history={history} context={context} />
          )}
          linkingComplete={() => <LinkingComplete />}
        />
      </div>
    </div>
  );
}

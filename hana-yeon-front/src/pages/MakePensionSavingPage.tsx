import { useFunnel } from "@use-funnel/browser";
import { useLocation } from "react-router-dom";
import type { TPensionSavingFunnelSteps } from "@/types";
import Step1SelectType from "@/components/makePensionSaving/Step1SelectType";
import Step2Info from "@/components/makePensionSaving/Step2Info";
import Step3AgreeInfo from "@/components/makePensionSaving/Step3AgreeInfo";
import Step4Input from "@/components/makePensionSaving/Step4Input";
import Step5Result from "@/components/makePensionSaving/Step5Result";

export default function MakePensionSavingPage() {
  const location = useLocation();
  const { from } = location.state || {};

  const funnel = useFunnel<TPensionSavingFunnelSteps>({
    id: "pension-saving-funnel",
    initial:
      from === "survey"
        ? {
            step: "agreeInfo",
            context: {
              selectedType: "discretionary",
            },
          }
        : {
            step: "selectType",
            context: {},
          },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 min-h-0">
        <funnel.Render
          selectType={({ history }) => <Step1SelectType history={history} />}
          showInfo={({ history, context }) => (
            <Step2Info history={history} context={context} />
          )}
          agreeInfo={({ history, context }) => (
            <Step3AgreeInfo history={history} context={context} />
          )}
          inputInfo={({ history, context }) => (
            <Step4Input history={history} context={context} />
          )}
          complete={({ context }) => <Step5Result context={context} />}
        />
      </div>
    </div>
  );
}

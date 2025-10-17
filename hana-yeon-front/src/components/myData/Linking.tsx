import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
// hooks
import { useRegisterAccount, useRegisterInsurance } from "@/hooks/api";
import { delay } from "@/lib";

export default function Linking({
  history,
  context,
}: {
  history: any;
  context: any;
}) {
  const [accountRegistered, setAccountRegistered] = useState(false);
  const [insuranceRegistered, setInsuranceRegistered] = useState(false);

  const { accountList, insuranceList } = context;

  const {
    mutate: registerAccountMutation,
    isSuccess: isRegisterAccountSuccess,
    isError: isRegisterAccountError,
  } = useRegisterAccount();

  const {
    mutate: registerInsuranceMutation,
    isSuccess: isRegisterInsuranceSuccess,
    isError: isRegisterInsuranceError,
  } = useRegisterInsurance();

  const [steps, setSteps] = useState([
    { id: 0, title: "은행 정보 연결", status: "pending", type: "account" },
    { id: 1, title: "카드 정보 연결", status: "pending", type: "card" },
    { id: 2, title: "증권 정보 연결", status: "pending", type: "stock" },
    { id: 3, title: "보험 정보 연결", status: "pending", type: "insurance" },
  ]);

  useEffect(() => {
    const executeRegistrations = async () => {
      if (accountList && accountList.length > 0) {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === 0 ? { ...step, status: "in-progress" } : step
          )
        );
        await delay(1500);
        registerAccountMutation({ accountList });
      } else {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === 0 ? { ...step, status: "completed" } : step
          )
        );
        setAccountRegistered(true);
      }
    };

    executeRegistrations();
  }, [accountList, registerAccountMutation]);

  useEffect(() => {
    if (isRegisterAccountSuccess) {
      setAccountRegistered(true);
      setSteps((prev) =>
        prev.map((step) =>
          step.id === 0 ? { ...step, status: "completed" } : step
        )
      );
    }
    if (isRegisterAccountError) {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === 0 ? { ...step, status: "error" } : step
        )
      );
      setAccountRegistered(true); 
    }
  }, [isRegisterAccountSuccess, isRegisterAccountError]);

  useEffect(() => {
    if (accountRegistered && !insuranceRegistered) {
      setSteps((prev) =>
        prev.map((step) => {
          if (step.id === 1) return { ...step, status: "completed" };
          if (step.id === 2) return { ...step, status: "completed" }; 
          return step;
        })
      );

      setTimeout(() => {
        if (insuranceList && insuranceList.length > 0) {
          setSteps((prev) =>
            prev.map((step) =>
              step.id === 3 ? { ...step, status: "in-progress" } : step
            )
          );

          registerInsuranceMutation({ insuranceList });
        } else {
          setSteps((prev) =>
            prev.map((step) =>
              step.id === 3 ? { ...step, status: "completed" } : step
            )
          );
          setInsuranceRegistered(true);
        }
      }, 500); /
    }
  }, [
    accountRegistered,
    insuranceRegistered,
    insuranceList,
    registerInsuranceMutation,
  ]);

  useEffect(() => {
    if (isRegisterInsuranceSuccess) {
      setInsuranceRegistered(true);
      setSteps((prev) =>
        prev.map((step) =>
          step.id === 3 ? { ...step, status: "completed" } : step
        )
      );
    }
    if (isRegisterInsuranceError) {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === 3 ? { ...step, status: "error" } : step
        )
      );
      setInsuranceRegistered(true); 
    }
  }, [isRegisterInsuranceSuccess, isRegisterInsuranceError]);

  useEffect(() => {
    if (accountRegistered && insuranceRegistered) {
      setTimeout(() => {
        history.push("linkingComplete");
      }, 500); 
    }
  }, [accountRegistered, insuranceRegistered, history]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return (
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        );
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;

      default: 
        return (
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
        );
    }
  };

  const getStepTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "in-progress":
        return "text-brand";
      case "error":
        return "text-red-600 dark:text-red-400";
      default: 
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "연결 완료";
      case "in-progress":
        return "연결 중...";
      case "error":
        return "연결 실패";
      default:
        return "대기 중";
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            정보를 안전하게 연결하고 있어요
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            잠시만 기다려주세요. 모든 정보가 암호화되어 전송됩니다.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                step.status === "completed" || step.status === "in-progress"
                  ? "border-brand bg-brand/5 dark:bg-brand/10"
                  : step.status === "error"
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-darkCard"
              }`}
            >
              <div className="flex items-center">
                {getStepIcon(step.status)}
                <div className="ml-4 flex-1">
                  <h3
                    className={`font-semibold ${getStepTextColor(step.title)}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      step.status === "error"
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-200"
                    }`}
                  >
                    {getStepStatusText(step.status)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                보안 연결
              </h3>
              <p className="text-sm text-green-700 dark:text-green-200">
                모든 데이터는 SSL 암호화를 통해 안전하게 전송됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
// hooks
import { useSearchAllAssets } from "@/hooks/api";
import { delay } from "@/lib";
// store
import { useAuthStore } from "@/store";
// components
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function FetchMyData({ history }: { history: any }) {
  const { data } = useSearchAllAssets();
  const { userInfo } = useAuthStore();

  const [text, setText] = useState(
    `${userInfo?.userName ?? "고객"}님의 정보를 불러오고 있어요`
  );
  const [isFinished, setIsFinished] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const handleFinish = useCallback(() => {
    setIsFinished(true);
  }, [history, data]);

  useEffect(() => {
    if (isFinished && data) {
      history.push("showDataToLink", {
        accountList: data.data.accountList,
        insuranceList: data.data.insuranceList,
      });
    }
  }, [isFinished, data, history]);

  const changeTextWithFade = async (newText: string, delaySec: number) => {
    await delay(delaySec);
    setOpacity(0);
    await delay(700);
    setText(newText);
    setOpacity(1);
  };

  useEffect(() => {
    (async () => {
      await delay(700);
      await changeTextWithFade("잠시만 기다려주세요", 0);
      await delay(1500);
      await changeTextWithFade("하나연(緣)이 자산관리 도와드릴게요", 0);
      await delay(500);
    })();
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 aurora-bg">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm mx-auto">
        <div className="mb-12">
          <img
            src="/hana3dIcon/hanaIcon3d_87.png"
            alt="자산 불러오기"
            className="w-24 h-24 object-contain"
          />
        </div>

        <h1
          className="text-gray-900 dark:text-white text-xl font-medium text-center mb-16 leading-relaxed transition-opacity duration-300"
          style={{ opacity }}
        >
          {text}
        </h1>

        <div className="mb-8">
          <AnimatedCounter className="mb-2" onFinish={handleFinish} />
          <p className="text-olo text-lg text-center">완료</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 right-6">
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
          불러올 수 없는 자산도 있어요
        </p>
      </div>
    </div>
  );
}

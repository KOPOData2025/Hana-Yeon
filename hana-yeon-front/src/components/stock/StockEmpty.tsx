import { StickyNote } from "lucide-react";
import Button from "@/components/ui/Button";
import { useInternalRouter, useMobile } from "@/hooks";
import { Spacing } from "tosslib";
import { PATH } from "@/constants";

export default function StockEmpty() {
  const { goHanaStock } = useMobile();
  const router = useInternalRouter();

  return (
    <div className="flex flex-col items-center h-full py-10">
      <StickyNote className="w-32 h-32 font-light text-gray-400 dark:gray-200" />
      <h2 className="text-xl font-bold py-5">갖고 있는 증권이 없어요</h2>

      <Spacing size={50} />

      <span className="text-base pb-4 text-gray-700 dark:text-gray-400">
        주식이 있는데 안 보이나요? 마이데이터를 연결하세요
      </span>
      <Button
        className="w-4/5 h-14 bg-gradient-to-r from-brand to-olo"
        onClick={() => router.push(PATH.MY_DATA)}
      >
        내 주식 보기
      </Button>

      <Spacing size={40} />

      <span className="text-base pb-4 text-gray-700 dark:text-gray-400">
        또는 투자를 시작해보세요
      </span>

      <div
        className="w-4/5 h-14 flex items-center justify-center font-semibold text-white rounded-md bg-gradient-to-r from-brand to-olo"
        onClick={() => goHanaStock()}
        role="button"
      >
        주식 시작하고 1000
        <img src="hanamoney.png" className="w-5 h-5 mr-2" />
        받기
      </div>
    </div>
  );
}

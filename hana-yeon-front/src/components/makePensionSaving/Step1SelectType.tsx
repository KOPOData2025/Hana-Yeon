import { Spacing } from "tosslib";

interface Step1SelectTypeProps {
  history: any;
}

export default function Step1SelectType({ history }: Step1SelectTypeProps) {
  const handleSelectType = (type: "discretionary" | "trust") => {
    history.push("showInfo", { selectedType: type });
  };

  return (
    <div className="flex bg-gray-50 dark:bg-darkCard flex-col justify-end h-full p-6 pt-0">
      <div className="mt-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          연금저축계좌 유형을
        </h1>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          선택해주세요
        </h1>
      </div>

      <div className="flex flex-col mt-10 gap-4 flex-1">
        <button
          className="w-full min-h-32 rounded-lg bg-gradient-to-br from-teal-400 to-olo dark:from-teal-600 dark:to-emerald-700 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 border-none cursor-pointer p-4"
          onClick={() => handleSelectType("discretionary")}
        >
          <img
            src="/hana3dIcon/hanaIcon3d_4_85.png"
            alt="일임형"
            className="w-16 h-16 object-contain"
          />
          <span className="text-white dark:text-gray-100 font-semibold text-lg">
            일임형
          </span>
          <span className="text-white/90 dark:text-gray-200 text-sm">
            금융사 투자 전문가에게 위임하는 방식이에요
          </span>
        </button>

        <Spacing size={10} />

        <button
          className="w-full min-h-32 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-700 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 border-none cursor-pointer p-4"
          onClick={() => handleSelectType("trust")}
        >
          <img
            src="/hana3dIcon/hanaIcon3d_4_51.png"
            alt="신탁형"
            className="w-16 h-16 object-contain"
          />
          <span className="text-white dark:text-gray-100 font-semibold text-lg">
            신탁형
          </span>
          <span className="text-white/90 dark:text-gray-200 text-sm">
            개인이 직접 상품을 고르고 운용하는 방식이에요
          </span>
        </button>
      </div>
    </div>
  );
}

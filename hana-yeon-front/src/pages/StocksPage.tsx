import { useSessionStorage } from "usehooks-ts";
// hooks
import { useInternalRouter } from "@/hooks";
import { useGetAllAccount } from "@/hooks/api";
// constants
import { PATH, stockData } from "@/constants";
// components
import HoldingStockList from "@/components/stock/HoldingStockList";
import StockTotalCard from "@/components/stock/StockTotalCard";
import ByulButPopUp from "@/components/ui/ByulButPopUp";
import StockEmpty from "@/components/stock/StockEmpty";

const StocksPage = () => {
  const { data } = useGetAllAccount();
  const [value, setValue] = useSessionStorage("show-stock-survey-popup", true);
  const router = useInternalRouter();

  const handleSurveyClick = () => {
    router.push(PATH.SURVEY);
  };

  if (data?.data.length === 0) {
    return <StockEmpty />;
  }

  return (
    <div className="p-4 relative">
      <StockTotalCard stockData={stockData} />
      <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        보유 종목
      </h2>
      <HoldingStockList stockData={stockData} />

      <ByulButPopUp
        popupContent={
          value ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <img src="hana3dIcon/hanaIcon3d_49.png" className="w-6" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  투자성향 진단
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                나에게 맞는 투자 방법을 찾아보세요!
              </p>

              <button
                onClick={handleSurveyClick}
                className="w-full bg-gradient-to-r from-olo to-brand text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                지금 진단하기
              </button>
            </div>
          ) : undefined
        }
        onPopupClose={() => setValue(false)}
      />
    </div>
  );
};

export default StocksPage;

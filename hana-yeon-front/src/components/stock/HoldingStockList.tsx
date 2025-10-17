import { formatCurrency } from "@/lib";
import type { stockData } from "@/constants";

interface HoldingStockListProps {
  stockData: typeof stockData;
}

export default function HoldingStockList({ stockData }: HoldingStockListProps) {
  return (
    <div className="space-y-3">
      {stockData.holdings.map((stock, i) => {
        const isStockPositive = stock.profit >= 0;
        return (
          <div
            key={i}
            className="bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {stock.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                평가금액 {formatCurrency(stock.value, "원")}
              </p>
            </div>
            <div
              className={`text-right ${
                isStockPositive ? "text-red-400" : "text-blue-400"
              }`}
            >
              <p className="font-semibold">
                {isStockPositive ? "+" : ""}
                {formatCurrency(stock.profit, "원")}
              </p>
              <p className="text-sm">
                ({isStockPositive ? "+" : ""}
                {stock.profitPercent}%)
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

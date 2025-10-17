import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib";
import type { stockData } from "@/constants";

interface StockTotalCardProps {
  stockData: typeof stockData;
}

export default function StockTotalCard({ stockData }: StockTotalCardProps) {
  const isPositive = stockData.change >= 0;

  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl p-5 mb-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">총 자산</p>
      <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
        {formatCurrency(stockData.totalValue, "원")}
      </p>
      <div
        className={`flex items-center gap-2 mt-1 text-sm ${
          isPositive ? "text-red-400" : "text-blue-400"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>
          {formatCurrency(stockData.change, "원")} ({isPositive ? "+" : ""}
          {stockData.changePercent}%)
        </span>
      </div>
      <div className="h-24 mt-4 -mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stockData.history}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#F87171" : "#60A5FA"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#F87171" : "#60A5FA"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.5)",
                border: "none",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#F87171" : "#60A5FA"}
              strokeWidth={2}
              fill="url(#stockGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

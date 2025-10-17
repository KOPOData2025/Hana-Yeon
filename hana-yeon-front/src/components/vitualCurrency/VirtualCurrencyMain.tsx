import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// hooks
import { useGetUpbitAccounts } from "@/hooks/api";
import { useUpbitSocket } from "@/hooks";
// types
import type { Ticker } from "@/types";
// constants
import { VIRTUAL_CURRENCY_MAP, VIRTUAL_CURRENCY_COLORS } from "@/constants";

export default function VirtualCurrencyMain() {
  const { data: assets = [] } = useGetUpbitAccounts();

  const [flashStates, setFlashStates] = useState<
    Map<string, { type: "red" | "blue" | null; timestamp: number }>
  >(new Map());

  const codes = (Array.isArray(assets) ? assets : [])
    .filter((asset) => asset.currency !== "KRW")
    .map((asset) => `${asset.unit_currency}-${asset.currency}`);

  const { ticker, isConnected } = useUpbitSocket(codes);

  const prevTickerRef = useRef<Map<string, Ticker>>(new Map());

  useEffect(() => {
    ticker.forEach((newTicker, code) => {
      const prevTicker = prevTickerRef.current.get(code);

      if (prevTicker && prevTicker.trade_price !== newTicker.trade_price) {
        const flashType =
          newTicker.trade_price > prevTicker.trade_price ? "red" : "blue";

        setFlashStates((prevFlash) =>
          new Map(prevFlash).set(code, {
            type: flashType,
            timestamp: Date.now(),
          })
        );

        setTimeout(() => {
          setFlashStates((prevFlash) => {
            const newFlash = new Map(prevFlash);
            const current = newFlash.get(code);
            if (current && current.timestamp <= Date.now() - 450) {
              newFlash.set(code, {
                type: null,
                timestamp: Date.now(),
              });
            }
            return newFlash;
          });
        }, 700);
      }
    });

    prevTickerRef.current = new Map(ticker);
  }, [ticker]);

  const portfolio = (Array.isArray(assets) ? assets : []).map((asset) => {
    const [totalAsset, setTotalAsset] = useState(0);

    const marketCode = `${asset.unit_currency}-${asset.currency}`;
    const currentTicker = ticker.get(marketCode);
    const currentPrice =
      asset.currency === "KRW" ? 1 : currentTicker?.trade_price ?? 0;

    const balance = parseFloat(asset.balance);
    const avgBuyPrice = parseFloat(asset.avg_buy_price);

    const valuationAmount = balance * currentPrice;
    const totalBuyAmount = balance * avgBuyPrice;
    const valuationPL = valuationAmount - totalBuyAmount;
    const returnRate =
      totalBuyAmount > 0 ? (valuationPL / totalBuyAmount) * 100 : 0;

    useEffect(() => {
      const sum = assets.reduce((acc, asset) => acc + Number(asset.balance), 0);
      setTotalAsset(sum);
    }, [assets]);

    return {
      ...asset,
      valuationAmount,
      totalBuyAmount,
      valuationPL,
      returnRate,
      currentPrice,
    };
  });

  const totalPortfolioValue = portfolio.reduce(
    (sum, asset) => sum + asset.valuationAmount,
    0
  );

  const portfolioForChart = portfolio
    .map((asset) => ({
      name: asset.currency,
      value: asset.valuationAmount,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const requiredTickerCodes = (Array.isArray(assets) ? assets : [])
    .filter((asset) => asset.currency !== "KRW")
    .map((asset) => `${asset.unit_currency}-${asset.currency}`);
  const isChartDataReady = requiredTickerCodes.every((code) =>
    ticker.has(code)
  );

  return (
    <div className="bg-background dark:bg-darkBg min-h-[calc(100vh-64px-96px)] text-gray-800 dark:text-white px-4 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">보유자산 포트폴리오</h1>
        <div
          className={`text-sm px-2 py-1 rounded ${
            isConnected
              ? "bg-olo text-gray-100 dark:bg-brand dark:text-gray-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {isConnected ? "실시간 연결됨" : "연결 중..."}
        </div>
      </div>

      <div className="bg-white dark:bg-darkCard px-4 rounded-lg mb-6 shadow-sm">
        <div
          style={{ width: "100%", height: 200 }}
          className="flex items-center justify-around"
        >
          {isChartDataReady ? (
            <>
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioForChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {portfolioForChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          VIRTUAL_CURRENCY_COLORS[
                            index % VIRTUAL_CURRENCY_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current text-gray-500 dark:fill-[#A0AEC0]"
                    fontSize="12"
                  >
                    보유비중
                  </text>
                  <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current text-gray-500 dark:fill-[#A0AEC0]"
                    fontSize="12"
                  >
                    (%)
                  </text>
                </PieChart>
              </ResponsiveContainer>

              <div className="w-1/3 flex flex-col justify-center space-y-2">
                {portfolioForChart.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div
                      style={{
                        backgroundColor:
                          VIRTUAL_CURRENCY_COLORS[
                            index % VIRTUAL_CURRENCY_COLORS.length
                          ],
                      }}
                      className="w-3 h-3 rounded-full mr-2"
                    ></div>
                    <span className="text-gray-600 dark:text-gray-300 mr-auto">
                      {entry.name}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-300">
                      {((entry.value / totalPortfolioValue) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
                <div className="text-end pt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    총 보유자산
                  </span>
                  <h2 className="text-lg text-olo font-semibold">
                    {portfolio
                      .reduce((acc, asset) => acc + ~~asset.valuationAmount, 0)
                      .toLocaleString()}
                    &nbsp;KRW
                  </h2>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              실시간 시세 정보 로딩 중...
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {portfolio
          .filter((a) => a.currency !== "KRW")
          .map((asset) => (
            <div
              key={asset.currency}
              className="bg-white dark:bg-darkCard p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-gray-300">
                    {VIRTUAL_CURRENCY_MAP.get(asset.currency)}
                    <br />({asset.currency})
                  </h2>
                </div>
                <div
                  className={`text-right  ${(() => {
                    const marketCode = `${asset.unit_currency}-${asset.currency}`;
                    const flashState = flashStates.get(marketCode);
                    if (flashState?.type === "red")
                      return "animate-flash-border-red";
                    if (flashState?.type === "blue")
                      return "animate-flash-border-blue";
                    return "";
                  })()}`}
                >
                  <div className="text-gray-800 dark:text-gray-300 transition-all duration-500 font-semibold">
                    {asset.valuationAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    &nbsp;{asset.unit_currency}
                  </div>
                  <div
                    className={`text-sm transition-all duration-500 ${
                      asset.returnRate >= 0 ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    {asset.returnRate.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                <div className="text-gray-800 dark:text-gray-300">보유수량</div>
                <div className="text-right font-mono">
                  {parseFloat(asset.balance).toFixed(8)}&nbsp;{asset.currency}
                </div>

                <div className="text-gray-800 dark:text-gray-300">
                  매수평균가
                </div>
                <div className="text-right font-mono">
                  {asset.avg_buy_price.toLocaleString()}
                  &nbsp;{asset.unit_currency}
                </div>

                <div className="text-gray-800 dark:text-gray-300">매수금액</div>
                <div className="text-right font-mono">
                  {asset.totalBuyAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  &nbsp;{asset.unit_currency}
                </div>

                <div className="text-gray-800 dark:text-gray-300">평가손익</div>
                <div className="flex justify-end">
                  <span
                    className={`font-mono transition-all duration-500 ${
                      asset.valuationPL >= 0 ? "text-red-500" : "text-blue-500"
                    } ${(() => {
                      const marketCode = `${asset.unit_currency}-${asset.currency}`;
                      const flashState = flashStates.get(marketCode);
                      if (flashState?.type === "red")
                        return "animate-flash-border-red";
                      if (flashState?.type === "blue")
                        return "animate-flash-border-blue";
                      return "";
                    })()}`}
                  >
                    {asset.valuationPL.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

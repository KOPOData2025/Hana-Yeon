import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
// hooks
import { useInternalRouter, useMobile } from "@/hooks";
// utils
import { formatCurrency } from "@/lib";
// constants
import { assetChartConfig, assetData, PATH } from "@/constants";
// components
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { GetAllAccountsResponse, UpbitAccount } from "@/types";
// utils
import { Spacing } from "tosslib";

interface HomePieChartProps {
  isLoading: boolean;
  allAccounts?: GetAllAccountsResponse;
  virtualCurrency: UpbitAccount[];
}

export default function HomePieChart({
  isLoading,
  allAccounts,
  virtualCurrency,
}: HomePieChartProps) {
  const router = useInternalRouter();
  const { goHanaBank } = useMobile();

  const virtualCurrencyValue = ~~(
    Array.isArray(virtualCurrency) ? virtualCurrency : []
  ).reduce((sum: number, asset: UpbitAccount) => {
    const balance = parseFloat(asset.balance || "0");
    const avgPrice = parseFloat(asset.avg_buy_price || "0");
    return sum + balance * avgPrice;
  }, 0);

  const totalMoney = useMemo(
    () =>
      virtualCurrencyValue +
      (allAccounts?.reduce((acc, cur) => acc + Number(cur.balanceAmt), 0) ?? 0),
    [allAccounts, virtualCurrencyValue]
  );

  const assetDistribution = useMemo(() => {
    if (!allAccounts || !Array.isArray(virtualCurrency)) {
      return assetData.details;
    }

    const sumByType = (types: string[]) =>
      allAccounts
        .filter(({ accountType }) => types.includes(accountType))
        .reduce((sum, acc) => sum + Number(acc.balanceAmt || 0), 0);

    const chartData = [
      {
        name: "예금",
        value: sumByType(["SAVINGS", "CHECKING", "DEPOSIT"]),
        fill: "#3B82F6",
      },
      {
        name: "적금",
        value: sumByType(["INSTALLMENT_SAVINGS", "SAVINGS"]),
        fill: "#10B981",
      },
      {
        name: "개인연금",
        value: allAccounts
          .filter(
            ({ accountType }) =>
              (accountType.includes("PENSION") ||
                accountType.includes("IRP")) &&
              !accountType.includes("RETIREMENT")
          )
          .reduce((sum, acc) => sum + Number(acc.balanceAmt || 0), 0),
        fill: "#F59E0B",
      },
      {
        name: "퇴직연금",
        value: allAccounts
          .filter(({ accountType }) => accountType.includes("RETIREMENT"))
          .reduce((sum, acc) => sum + Number(acc.balanceAmt || 0), 0),
        fill: "#EF4444",
      },
      { name: "가상화폐", value: virtualCurrencyValue, fill: "#8B5CF6" },
    ].filter((item) => item.value > 0);

    return chartData;
  }, [allAccounts, virtualCurrencyValue]);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-darkCard border-none">
        <CardHeader>
          <div className="w-32 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex-1 space-y-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="ml-2 h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalMoney <= 0 || (allAccounts && allAccounts.length <= 0)) {
    return (
      <Card className="bg-white dark:bg-darkCard border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            발견된 자산이 없어요 😅
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <button
            className="w-full h-32 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 dark:from-teal-600 dark:to-emerald-700 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 border-none cursor-pointer"
            onClick={() => router.push(PATH.MY_DATA)}
          >
            <img
              src="/hana3dIcon/hanaIcon3d_4_51.png"
              alt="내 자산 불러오기"
              className="w-16 h-16 object-contain"
            />
            <span className="text-white dark:text-gray-100 font-semibold">
              내 자산 불러오기
            </span>
          </button>
          <Spacing size={10} />
          <button
            className="w-full h-32 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-700 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 border-none cursor-pointer"
            onClick={goHanaBank}
          >
            <img
              src="/hana3dIcon/hanaIcon3d_4_67.png"
              alt="하나은행 계좌 개설하기"
              className="w-16 h-16 object-contain"
            />
            <span className="text-white dark:text-gray-100 font-semibold">
              하나은행 계좌 개설
            </span>
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-darkCard border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalMoney, "원")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <ChartContainer config={assetChartConfig} className="h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="whitespace-nowrap"
                  />
                }
              />
              <Pie
                data={assetDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={30}
                strokeWidth={2}
              >
                {assetDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex-1 space-y-1">
          {assetDistribution.map((item) => (
            <div key={item.name} className="flex items-center text-sm">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></span>
              <span className="ml-2 text-gray-500 dark:text-gray-300">
                {item.name}
              </span>
              <span className="ml-auto font-medium text-gray-900 dark:text-white">
                {formatCurrency(Math.ceil(item.value / 10000))}만원
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
// hooks
import { useGetPensionAccount, useGetAccountDetailQueries } from "@/hooks/api";
import { formatCurrency10000 } from "@/lib";
import PensionSection from "@/components/pension/PensionSection";

export default function ExpectedDeposit() {
  const { data: pensionAccounts = [] } = useGetPensionAccount();
  const pensionTransactions = useGetAccountDetailQueries(
    pensionAccounts.map(({ accountNum }) => accountNum)
  );

  const chartData = useMemo(() => {
    const toNumber = (v?: string | null) => (v ? Number(v) : 0);

    const now = new Date();
    const months = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });

    const allLoaded = pensionTransactions.every((q) => q.isSuccess);
    if (!allLoaded) {
      return months.map((month) => ({ month, amount: 0 }));
    }

    const allTransactions = pensionTransactions.flatMap((query) => {
      if (!query.data?.data?.resList) return [];
      return query.data.data.resList;
    });

    const depositsByMonth = new Map<string, number>();

    allTransactions.forEach((transaction) => {
      const tranDate = transaction.tranDate.replace(/-/g, "");
      const yearMonth = `${tranDate.substring(0, 4)}-${tranDate.substring(
        4,
        6
      )}`;

      if (
        transaction.inoutType === "입금" ||
        transaction.inoutType === "IN" ||
        transaction.inoutType === "1"
      ) {
        const amount = toNumber(transaction.tranAmt);
        depositsByMonth.set(
          yearMonth,
          (depositsByMonth.get(yearMonth) || 0) + amount
        );
      }
    });

    return months.map((month) => {
      const monthlyDeposit = depositsByMonth.get(month) || 0;
      return { month, amount: Math.round(monthlyDeposit / 10000) };
    });
  }, [pensionTransactions]);

  return (
    <PensionSection title="월별 납입액">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--olo))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--olo))"
                  stopOpacity={0.4}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} unit="" />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => `${value}만`}
            />
            <RechartsTooltip
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
              labelFormatter={() => ""}
              formatter={(value: number) => [
                formatCurrency10000(value * 10000),
              ]}
            />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              fill="url(#colorSpending)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PensionSection>
  );
}

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useMemo } from "react";
import { useGetPensionAccount } from "@/hooks/api";

const CATEGORIES = [
  { name: "현금성/예금", key: "CASH", fill: "hsl(var(--chart-1))" },
  { name: "채권형", key: "BOND", fill: "hsl(var(--chart-2))" },
  { name: "주식·혼합형", key: "STOCK_MIXED", fill: "hsl(var(--chart-3))" },
] as const;

export default function PersonalPensionComposition() {
  const { data: accounts = [] } = useGetPensionAccount();

  const { chartData } = useMemo(() => {
    const personal = accounts.filter(
      (a) =>
        a.accountType.includes("PENSION") &&
        !a.accountType.includes("RETIREMENT")
    );

    const total = personal.reduce((s, a) => s + Number(a.balanceAmt || 0), 0);

    let cash = 0,
      bond = 0,
      stock = 0;
    personal.forEach((a) => {
      const bal = Number(a.balanceAmt || 0);
      if (a.accountType === "PENSION_INSURANCE") {
        bond += bal * 0.6;
        cash += bal * 0.4;
      } else if (a.accountType === "PENSION_TRUST") {
        bond += bal * 0.5;
        stock += bal * 0.5;
      } else if (a.accountType === "PENSION_FUND") {
        stock += bal;
      } else {
        cash += bal;
      }
    });

    const toPct = (v: number) =>
      total > 0 ? Math.round((v / total) * 100) : 0;

    const data = [
      {
        name: CATEGORIES[0].name,
        value: toPct(cash),
        fill: CATEGORIES[0].fill,
      },
      {
        name: CATEGORIES[1].name,
        value: toPct(bond),
        fill: CATEGORIES[1].fill,
      },
      {
        name: CATEGORIES[2].name,
        value: toPct(stock),
        fill: CATEGORIES[2].fill,
      },
    ].sort((a, b) => b.value - a.value);

    return { chartData: data };
  }, [accounts]);

  return (
    <div className="h-52 flex items-center gap-4">
      <ResponsiveContainer width="40%" height="100%">
        <PieChart>
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "rgba(252,252,252,0.7)",
              border: "none",
            }}
          />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={35}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 flex flex-col gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-gray-900 dark:text-white text-sm">
              {item.name}
            </span>
            <span className="text-gray-500 text-sm ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

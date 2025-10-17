import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

import { mainAccount } from "@/constants";

interface MainAccountSpendGraphProps {
  data: typeof mainAccount;
}
export default function MainAccountSpendGraph({
  data,
}: MainAccountSpendGraphProps) {
  return (
    <div className="h-24 mt-4 -mb-5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.balanceHistory}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#FFFFFF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

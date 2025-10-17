import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronUp, Info } from "lucide-react";
// Recharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// lib
import { formatCurrency10000 } from "@/lib";
// store
import { useAuthStore } from "@/store";
// types
import type { IPensionComparison } from "./Step4Analyzing";
import { useInternalRouter } from "@/hooks";
import { PATH } from "@/constants";

interface Step5ResultProps {
  comparisonData?: IPensionComparison;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const myValue = payload.find((p: any) => p.dataKey === "me")?.value;
    const peerValue = payload.find((p: any) => p.dataKey === "peer")?.value;
    const difference = myValue - peerValue;

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl text-sm space-y-1">
        <p className="font-bold text-gray-900 dark:text-white">{label}</p>
        <p className="text-blue-600 dark:text-blue-400">
          나: {formatCurrency10000(myValue)}
        </p>
        <p className="text-orange-600 dark:text-orange-400">
          또래 평균: {formatCurrency10000(peerValue)}
        </p>
        <p
          className={`font-semibold ${
            difference >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          차이: {difference > 0 ? "+" : ""}
          {formatCurrency10000(difference)}
        </p>
      </div>
    );
  }

  return null;
};

const formatYAxisTick = (value: number) => {
  return formatCurrency10000(value);
};

export default function Step5Result({ comparisonData }: Step5ResultProps) {
  const { userInfo } = useAuthStore();

  const [showCalculationMethod, setShowCalculationMethod] = useState(false);
  const router = useInternalRouter();

  if (!comparisonData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-300">
          데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  const difference = comparisonData.differences.total;

  const chartData = [
    {
      name: "국민연금",
      me: Math.round(comparisonData.user.nationalPension / 10000) * 10000,
      peer: Math.round(comparisonData.peer.nationalPension / 10000) * 10000,
      diff:
        Math.round(comparisonData.user.nationalPension / 10000) * 10000 -
        Math.round(comparisonData.peer.nationalPension / 10000) * 10000,
    },
    {
      name: "IRP",
      me: Math.round(comparisonData.user.retirementPension / 10000) * 10000,
      peer: Math.round(comparisonData.peer.retirementPension / 10000) * 10000,
      diff:
        Math.round(comparisonData.user.retirementPension / 10000) * 10000 -
        Math.round(comparisonData.peer.retirementPension / 10000) * 10000,
    },
    {
      name: "연금저축",
      me: Math.round(comparisonData.user.personalPension / 10000) * 10000,
      peer: Math.round(comparisonData.peer.personalPension / 10000) * 10000,
      diff:
        Math.round(comparisonData.user.personalPension / 10000) * 10000 -
        Math.round(comparisonData.peer.personalPension / 10000) * 10000,
    },
  ];

  const getBiggestDifference = () => {
    const diffs = [
      {
        name: "국민연금",
        value: Math.abs(comparisonData.differences.nationalPension),
        type: "nationalPension",
      },
      {
        name: "연금저축",
        value: Math.abs(comparisonData.differences.personalPension),
        type: "personalPension",
      },
      {
        name: "IRP",
        value: Math.abs(comparisonData.differences.retirementPension),
        type: "retirementPension",
      },
    ];

    return diffs.reduce((max, current) =>
      current.value > max.value ? current : max
    );
  };

  const biggestDiff = getBiggestDifference();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${
          difference > 0
            ? "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700"
            : "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-700"
        } rounded-2xl p-6 pb-2 text-center`}
      >
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {userInfo?.userName || "사용자"}님은 은퇴 후 또래보다
        </p>
        <p
          className={`text-3xl font-extrabold mb-1 ${
            difference > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          월 {formatCurrency10000(Math.abs(difference))}&nbsp;
          {difference > 0 ? "더 받아요" : "덜 받아요"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 pt-3">
          국민연금: 65세 기준
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          개인연금: 55세 기준
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-darkCard rounded-xl shadow-lg p-4 h-96"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="horizontal"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                type="category"
                stroke="#6B7280"
                className="text-sm"
              />
              <YAxis
                type="number"
                tickFormatter={formatYAxisTick}
                stroke="#6B7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />

              <Bar
                dataKey="me"
                name="나"
                fill="hsl(var(--brand))"
                radius={[4, 4, 0, 0]}
                unit="만원"
              />
              <Bar
                dataKey="peer"
                name="또래 평균"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                unit="만원"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="space-y-3">
        {chartData.map((item) => (
          <div
            key={item.name}
            className={`flex justify-between items-center rounded-xl p-3 ${
              Math.abs(item.diff) === biggestDiff.value
                ? item.diff > 0
                  ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700"
                  : "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700"
                : "bg-gray-50 dark:bg-gray-800/50"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
              <div className="flex items-center text-sm mt-2">
                <span className="text-gray-900 dark:text-white font-semibold">
                  나: {formatCurrency10000(item.me)}
                </span>
                <span className="text-gray-400 mx-2">|</span>

                <span className="text-gray-600 dark:text-gray-400">
                  또래 평균
                  {formatCurrency10000(item.peer)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-lg font-bold ${
                  item.diff === 0
                    ? "text-gray-600 dark:text-gray-200"
                    : item.diff > 0
                    ? "text-brand"
                    : "text-red-500"
                }`}
              >
                {item.diff > 0 ? "+" : item.diff < 0 ? "-" : ""}
                {formatCurrency10000(Math.abs(item.diff))}
              </span>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-300 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4"
      >
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          가장 큰 차이가 나는 부분
        </h4>
        <p
          className={`font-medium ${
            comparisonData.differences[
              biggestDiff.type as keyof IPensionComparison["differences"]
            ] < 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {biggestDiff.name}에서 월 {formatCurrency10000(biggestDiff.value)}
          {comparisonData.differences[
            biggestDiff.type as keyof IPensionComparison["differences"]
          ] < 0
            ? "이 부족해요"
            : "을 더 받아요"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {comparisonData.differences[
            biggestDiff.type as keyof IPensionComparison["differences"]
          ] < 0
            ? `${biggestDiff.name}${
                biggestDiff.name == "IRP" ? "를 개설하면" : "을 늘리면"
              } 노후 준비를 크게 개선할 수 있어요`
            : `${biggestDiff.name}에서 또래보다 우수한 준비를 하고 계시네요!`}
        </p>
      </motion.div>

      <div className="px-2">
        <span className="text-sm">⚠️</span>
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          예상 수급액은 실제와 다를 수 있어요.
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4"
      >
        <button
          onClick={() => setShowCalculationMethod(!showCalculationMethod)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              계산 방법이 궁금하신가요?
            </span>
          </div>
          {showCalculationMethod ? (
            <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </button>

        {showCalculationMethod && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3 text-sm text-blue-700 dark:text-blue-300"
          >
            <div className="border-l-2 border-blue-300 dark:border-blue-600 pl-3">
              <h5 className="font-semibold mb-1">
                {userInfo?.userName}님의 예상액
              </h5>
              <p>• {userInfo?.userName}님에게 맞는 연금소득세를 적용했어요.</p>
              <p>• 물가상승률은 반영하지 않았어요.</p>
            </div>

            <div className="border-l-2 border-blue-300 dark:border-blue-600 pl-3">
              <h5 className="font-semibold mb-1">또래 평균 데이터</h5>
              <p>• IRP, 연금저축을 모두 납입하는 또래 기준이에요.</p>
              <p>• 통계청의 평균 수령액, 납부액 데이터로 계산했어요.</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-3 pb-12">
        <div
          className="w-full bg-gradient-to-r from-[#00B2A9] to-[#008577] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={() => router.push(PATH.MAKE_PENSION_SAVING)}
          role="button"
        >
          <span>
            {biggestDiff.name === "연금저축" ? "연금저축" : "IRP"} 개설하고
          </span>
          <img src="/hanamoney.png" className="w-5 h-5 ml-2" />
          <span>받기</span>
          <ArrowRight className="w-5 h-5 animate-left-right" />
        </div>

        <div
          className="w-full bg-gradient-to-r from-[#00B2A9] to-[#008577] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={() => router.push(PATH.HOME)}
          role="button"
        >
          홈으로
        </div>
      </div>
    </motion.div>
  );
}

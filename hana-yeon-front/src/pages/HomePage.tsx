import { useCallback, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "motion/react";
import dayjs from "dayjs";
// hooks, libs
import { useInternalRouter, useHomePrefetch } from "@/hooks";
import { useGetAllAccount, useGetUpbitAccounts } from "@/hooks/api";
import { formatCurrency } from "@/lib";
// constants
import { otherAccounts, spendingData, PATH, BANK_IMAGE_MAP } from "@/constants";
// types
import type { GetAllAccountsResponse } from "@/types";
// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import TodaySummaryCard from "@/components/home/TodaySummaryCard";
import AiCoachCard from "@/components/home/AiCoachCard";
import HomeSection from "@/components/home/HomeSection";
import ListItem from "@/components/ui/ListItem";
import HomeCarousel from "@/components/home/HomeCarousel";
import ByulButPopUp from "@/components/ui/ByulButPopUp";
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";
import HomePieChart from "@/components/home/HomePieChart";
import MainAccountSpendGraph from "@/components/home/MainAccountSpendGraph";

export default function HomePage() {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const { data: allAccountsData, isLoading } = useGetAllAccount();
  const { data: virtualCurrencyData = [] } = useGetUpbitAccounts();

  const router = useInternalRouter();
  useHomePrefetch();

  const allAccounts = allAccountsData?.data ?? [];
  const mainAccount = allAccounts[0];

  const goAccountDetail = (account: GetAllAccountsResponse[0]) => {
    const state = {
      balanceAmt: account.balanceAmt,
      bankCodeStd: account.bankCodeStd,
      fintechUseNum: account.fintechUseNum,
    };

    router.push(`${PATH.ACCOUNT_DETAIL}/${account.accountNum}`, { state });
  };

  const goPredictNationalPensionPage = useCallback(() => {
    router.push(PATH.PREDICT_NATIONAL_PENSION);
  }, [router]);

  const goInsurancePage = useCallback(() => {
    router.push(PATH.INSURANCE);
  }, [router]);

  const currentMonth = dayjs().format("M");

  return (
    <div className="p-4">
      <div className="space-y-4 mb-8">
        <TodaySummaryCard
          isExpanded={isSummaryExpanded}
          onToggle={() => setIsSummaryExpanded(!isSummaryExpanded)}
        />

        {isSummaryExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <AiCoachCard />
          </motion.div>
        )}
      </div>

      <HomeCarousel />

      <div className="space-y-6">
        <ScrollFadeIn>
          <HomeSection title="내 자산">
            <HomePieChart
              isLoading={isLoading}
              allAccounts={allAccountsData?.data}
              virtualCurrency={virtualCurrencyData}
            />
          </HomeSection>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.1}>
          <HomeSection title="내 계좌">
            {mainAccount && (
              <div
                className="bg-gradient-to-br from-brand to-olo dark:from-olo/70 dark:to-brand/70 rounded-2xl p-5 text-gray-100"
                role="button"
                onClick={() => goAccountDetail(mainAccount)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={BANK_IMAGE_MAP.get(mainAccount.bankCodeStd)}
                        className="w-9 h-9"
                      />
                      <p className="opacity-80 font-semibold w-48 truncate">
                        {mainAccount.productName}
                      </p>
                    </div>
                    <p className="text-3xl font-bold mt-1">
                      {formatCurrency(Number(mainAccount.balanceAmt), "원")}
                    </p>
                  </div>
                  <button
                    className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(PATH.SEND_MONEY, {
                        state: {
                          selfBankCode: mainAccount.bankCodeStd,
                          selfAccount: mainAccount.accountNum,
                        },
                      });
                    }}
                  >
                    송금
                  </button>
                </div>
                <MainAccountSpendGraph data={mainAccount} />
              </div>
            )}
          </HomeSection>
        </ScrollFadeIn>
        {allAccounts.length > 0 && (
          <div className="space-y-3">
            {[...allAccounts.slice(1), ...otherAccounts].map((acc, i) => (
              <ScrollFadeIn key={i} delay={i * 0.05}>
                <div
                  className="flex items-center bg-white dark:bg-darkCard rounded-xl p-3"
                  role="button"
                  onClick={() => goAccountDetail(acc)}
                >
                  <img
                    src={BANK_IMAGE_MAP.get(acc.bankCodeStd)}
                    className="w-9 h-9"
                  />

                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate w-48">
                      {acc.productName}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white truncate w-48">
                      {formatCurrency(Number(acc.balanceAmt), "원")}
                    </p>
                  </div>
                  <button
                    className="ml-auto bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-lg text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(PATH.SEND_MONEY, {
                        state: {
                          selfBankCode: acc.bankCodeStd,
                          selfAccount: acc.accountNum,
                        },
                      });
                    }}
                  >
                    송금
                  </button>
                </div>
              </ScrollFadeIn>
            ))}
            <button
              className="w-full pt-3 text-center text-gray-500 dark:text-gray-300 text-sm font-medium"
              onClick={() => router.push(PATH.MY_DATA)}
            >
              안 보이는 계좌 찾기
            </button>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-gray-300 dark:bg-gray-800 my-6"></div>

      <div className="space-y-6">
        {allAccounts.length > 0 && (
          <ScrollFadeIn>
            <HomeSection title={`${currentMonth}월 소비`}>
              <Card className="bg-white dark:bg-darkCard border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(spendingData.total, "원")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingData.details}
                      margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorSpending"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--olo))"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--olo))"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis hide={true} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.1)" }}
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.7)",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        fill="url(#colorSpending)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </HomeSection>
          </ScrollFadeIn>
        )}

        <ScrollFadeIn delay={0.1}>
          <HomeSection
            title="기타 서비스"
            action={<MoreHorizontal className="w-5 h-5 text-gray-500" />}
          >
            <div className="bg-white dark:bg-darkCard rounded-2xl p-1">
              <ListItem
                icon={<img src="hana3dIcon/hanaIcon3d_2_87.png" />}
                title="연금 계산"
                subtitle="예상 수령액 확인"
                onClick={goPredictNationalPensionPage}
              />
              <ListItem
                icon={<img src="hana3dIcon/hanaIcon3d_2_13.png" />}
                title="카드"
                subtitle="사용 내역 및 혜택"
              />
              <ListItem
                icon={<img src="hana3dIcon/hanaIcon3d_2_67.png" />}
                title="보험"
                subtitle="내 보험 분석하기"
                onClick={goInsurancePage}
              />
            </div>
          </HomeSection>
        </ScrollFadeIn>
      </div>

      <ByulButPopUp />
    </div>
  );
}

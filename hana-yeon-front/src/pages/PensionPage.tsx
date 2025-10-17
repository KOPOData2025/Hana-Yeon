import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useSessionStorage } from "usehooks-ts";
// hooks
import { useInternalRouter } from "@/hooks";
import { useGetPensionAccount } from "@/hooks/api";
import { formatCurrency, futureValue } from "@/lib";
// constants
import { PATH } from "@/constants";
// store
import { useAuthStore } from "@/store";
// components
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import PensionProductItem from "@/components/pension/PensionProductItem";
import PensionSection from "@/components/pension/PensionSection";
import ExpectedReceive from "@/components/pension/ExpectedReceive";
import PersonalPensionComposition from "@/components/pension/PersonalPensionComposition";
import ByulButPopUp from "@/components/ui/ByulButPopUp";
import ListItem from "@/components/ui/ListItem";

export default function PensionPage() {
  const { userInfo } = useAuthStore();
  const { data = [] } = useGetPensionAccount();

  const {
    totalMonthlyPayoutAt65,
    totalPensionAssets,
    retirementAccounts,
    personalAccounts,
  } = useMemo(() => {
    const toNumber = (v?: string | null) => (v ? Number(v) : 0);

    const getYieldRate = (
      type?: string,
      provided?: number | null,
      riskLevel?: number | null
    ) => {
      if (typeof provided === "number" && !Number.isNaN(provided))
        return provided;
      if (!type) return 0;
      const baseByType: Record<string, number> = {
        PENSION_FUND: 7.6,
        PENSION_TRUST: 5.6,
        PENSION_INSURANCE: 2.6,
        RETIREMENT_IRP: 5.18,
      };
      const base = baseByType[type] ?? 4.0;
      const adj = riskLevel ? (riskLevel - 2) * 0.5 : 0;
      return Math.max(0, base + adj);
    };

    const retirement = data.filter(
      ({ accountType }) =>
        accountType.includes("IRP") || accountType.includes("RETIREMENT")
    );

    const personal = data.filter(
      ({ accountType }) =>
        accountType.includes("PENSION") &&
        !accountType.includes("IRP") &&
        !accountType.includes("RETIREMENT")
    );

    const totalAssets = data.reduce(
      (sum, a) => sum + toNumber(a.balanceAmt),
      0
    );

    const userAge = userInfo?.age ?? 55;
    const yearsToRetirement = Math.max(0, 55 - userAge);

    const accountsMonthlyAt65 = data.reduce((sum, a) => {
      const balance = toNumber(a.balanceAmt);
      const rate = getYieldRate(
        a.accountType,
        a.returnRate ?? null,
        a.riskLevel ?? null
      );
      const monthly = futureValue(
        balance,
        0,
        rate,
        yearsToRetirement,
        0,
        userAge
      );
      return sum + monthly;
    }, 0);

    return {
      totalMonthlyPayoutAt65: Math.floor(accountsMonthlyAt65),
      totalPensionAssets: totalAssets,
      retirementAccounts: retirement,
      personalAccounts: personal,
    };
  }, [data, userInfo?.age]);

  const [value, setValue] = useSessionStorage(
    "show-predict-pension-popup",
    true
  );
  const router = useInternalRouter();

  const goComparePensionPage = () => {
    router.push(PATH.COMPARE_PENSION);
  };

  return (
    <div className="p-4">
      <Card className="bg-gray-50 dark:bg-darkCard border-none text-center mb-6">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            은퇴 후 예상 월 수령액
          </p>
          <p className="text-4xl font-bold my-2 text-olo">
            {formatCurrency(totalMonthlyPayoutAt65, "원")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            총 적립액: {formatCurrency(totalPensionAssets)}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50 dark:bg-darkCard text-gray-600 dark:text-gray-400">
          <TabsTrigger value="all">메뉴</TabsTrigger>
          <TabsTrigger value="personal">개인연금</TabsTrigger>
          <TabsTrigger value="retirement">IRP</TabsTrigger>
          <TabsTrigger value="national">국민연금</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-6">
          <div className="space-y-6 mb-6">
            <ExpectedReceive />
          </div>

          <PensionSection title="보유 연금 상품">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">
              개인연금
            </h4>
            {personalAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                보유한 개인연금이 없습니다.
              </p>
            ) : (
              personalAccounts.map((a, i) => (
                <PensionProductItem
                  key={`per-${i}`}
                  provider={a.bankName}
                  productName={a.productName}
                  type={a.accountTypeName || a.accountType}
                  balance={Number(a.balanceAmt)}
                  returnRate={
                    typeof a.returnRate === "number" ? a.returnRate : 4.5
                  }
                />
              ))
            )}

            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">
              퇴직연금 (IRP)
            </h4>
            {retirementAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                보유한 퇴직연금이 없습니다.
              </p>
            ) : (
              retirementAccounts.map((a, i) => (
                <PensionProductItem
                  key={`ret-${i}`}
                  provider={a.bankName}
                  productName={a.productName}
                  type={a.accountTypeName || "IRP"}
                  balance={Number(a.balanceAmt)}
                  returnRate={
                    typeof a.returnRate === "number" ? a.returnRate : 5.18
                  }
                />
              ))
            )}
          </PensionSection>
        </TabsContent>

        <TabsContent
          value="national"
          className="pt-6 text-center text-gray-600 dark:text-gray-500"
        >
          <div className="flex  items-center justify-around bg-white dark:bg-darkCard rounded-2xl my-3">
            <ListItem
              icon={<img src="hana3dIcon/hanaIcon3d_2_87.png" />}
              title="내가 받을 국민연금 확인하기"
              onClick={() => router.push(PATH.PREDICT_NATIONAL_PENSION)}
            />
            <ChevronRight className="w-5 h-5" />
          </div>
        </TabsContent>

        <TabsContent value="personal" className="pt-6">
          <PensionSection title="보유 상품">
            {personalAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                보유한 개인연금이 없습니다.
              </p>
            ) : (
              <>
                <PensionSection title="개인연금 자산 구성">
                  <PersonalPensionComposition />
                </PensionSection>
                {personalAccounts.map((a, i) => (
                  <PensionProductItem
                    key={`per2-${i}`}
                    provider={a.bankName}
                    productName={a.productName}
                    type={a.accountTypeName || a.accountType}
                    balance={Number(a.balanceAmt)}
                    returnRate={
                      typeof a.returnRate === "number" ? a.returnRate : 4.5
                    }
                  />
                ))}
              </>
            )}
          </PensionSection>
        </TabsContent>

        <TabsContent value="retirement" className="pt-6">
          <PensionSection title="보유 상품">
            {retirementAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                보유한 퇴직연금이 없습니다.
              </p>
            ) : (
              retirementAccounts.map((a, i) => (
                <PensionProductItem
                  key={`ret2-${i}`}
                  provider={a.bankName}
                  productName={a.productName}
                  type={a.accountTypeName || "IRP"}
                  balance={Number(a.balanceAmt)}
                  returnRate={
                    typeof a.returnRate === "number" ? a.returnRate : 5.18
                  }
                />
              ))
            )}
          </PensionSection>
        </TabsContent>
      </Tabs>
      <ByulButPopUp
        popupContent={
          value ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <img src="hana3dIcon/hanaIcon3d_3_103.png" className="w-7" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  내 또래와 연금 비교
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                또래 평균 연금 수령액과 비교해보세요!
              </p>

              <button
                onClick={goComparePensionPage}
                className="w-full bg-gradient-to-r from-olo to-brand text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                지금 비교하기
              </button>
            </div>
          ) : undefined
        }
        onPopupClose={() => setValue(false)}
      />
    </div>
  );
}

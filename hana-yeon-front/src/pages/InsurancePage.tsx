import { Plus, Shield, AlertTriangle } from "lucide-react";
// hooks
import { useGetAllInsurance } from "@/hooks/api";
import { useInternalRouter } from "@/hooks";
import { formatCurrency, getUserAgeGroup } from "@/lib";
// store
import { useAuthStore } from "@/store";
// constants
import {
  PATH,
  INSURANCE_CODE_MAP,
  INSURANCE_IMAGE_MAP,
  INSURANCE_TYPE_CODE_MAP,
  AGE_GROUP_AVERAGE_PREMIUM,
} from "@/constants";
// components
import { Card, CardContent } from "@/components/ui/Card";

export default function InsurancePage() {
  const { data } = useGetAllInsurance();

  const { userInfo } = useAuthStore();

  const router = useInternalRouter();

  const insuranceList = data.data.insuList;

  const monthlyPremium = insuranceList.reduce(
    (acc, { monthlyPremium }) => acc + monthlyPremium,
    0
  );

  const userAgeGroup = getUserAgeGroup(userInfo?.age || 0);
  const averagePremium = AGE_GROUP_AVERAGE_PREMIUM.get(userAgeGroup) || 0;
  const difference = averagePremium - monthlyPremium;

  // 보험 타입별로 그룹화
  const groupedInsurance = insuranceList.reduce((acc, insurance) => {
    const type = insurance.insuType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(insurance);
    return acc;
  }, {} as Record<string, typeof insuranceList>);

  return (
    <div className="min-h-screen bg-background dark:bg-darkBg">
      <div className="p-4 space-y-6">
        {/* 월 보험료 섹션 */}
        <Card className="bg-white dark:bg-darkCard border-none shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                  월 보험료
                </p>
                <div className="flex items-center gap-2 justify-center text-3xl font-bold text-gray-900 dark:text-white mr-3">
                  <Shield className="w-8 h-8 text-gray-500 dark:text-gray-400 fill-olo stroke-[1px]" />
                  {formatCurrency(monthlyPremium, "원")}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-olo/10 rounded-lg p-3">
                <p
                  className={`text-sm font-medium ${
                    difference < 0
                      ? "text-olo dark:text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {userInfo?.userName || "고객"}님은 또래보다{" "}
                  {difference > 0
                    ? `${formatCurrency(difference, "원")} 덜 내요`
                    : `${formatCurrency(Math.abs(difference), "원")} 더 내요`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보험 목록 */}
        {Object.entries(groupedInsurance).map(([type, insurances]) => (
          <div key={type} className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
              {INSURANCE_TYPE_CODE_MAP.get(type)}
            </h2>
            <div className="space-y-3">
              {insurances.map((insurance) => (
                <Card
                  key={insurance.insuNum}
                  className="bg-white dark:bg-darkCard border-none shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={INSURANCE_IMAGE_MAP.get(insurance.institutionCode)}
                        alt={insurance.insuranceCompany}
                        className="w-9 h-9 rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                            {insurance.prodName}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {INSURANCE_CODE_MAP.get(insurance.institutionCode)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(insurance.monthlyPremium, "원")}
                          </span>
                          {insurance.insuStatus === "02" && (
                            <div className="flex items-center gap-1 text-red-500 text-xs">
                              <AlertTriangle className="w-3 h-3" />
                              <span>계약자가 다른 사람이에요</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            router.push(PATH.MY_DATA);
          }}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">안 보이는 보험 연결하기</span>
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed p-5 pt-10">
          보험사에서 제공하는 정보와 연동이 필요합니다.
          <br />
          가입한 보험이 보이지 않는 경우, 안 보이는 보험 연결하기 버튼을 통해
          추가하실 수 있습니다.
          <br />
          보험료는 각 보험사의 월 납입 보험료를 합산하여 계산됩니다.
        </div>
      </div>
    </div>
  );
}

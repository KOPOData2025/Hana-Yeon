import { Building2, CheckCircle } from "lucide-react";
import {
  INSURANCE_CODE_MAP,
  INSURANCE_IMAGE_MAP,
  BANK_IMAGE_MAP,
  ALL_FINANCIAL_INSTITUTIONS,
} from "@/constants";

import type { AccountInfo, InsuranceInfo } from "@/types";

export default function ShowDataToLink({
  history,
  context,
}: {
  history: any;
  context: any;
}) {
  const accountList = (context.accountList || []) as AccountInfo[];
  const insuranceList = (context.insuranceList || []) as InsuranceInfo[];

  const accountCountByBank = accountList.reduce((acc, account) => {
    acc[account.bankcode] = (acc[account.bankcode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const insuranceCountByCompany = insuranceList.reduce((acc, insurance) => {
    let companyCode = "";
    for (const [code, name] of INSURANCE_CODE_MAP.entries()) {
      if (
        name.includes(insurance.insuranceCompany) ||
        insurance.insuranceCompany.includes(name.replace("보험", "")) ||
        insurance.bankCodeStd === code
      ) {
        companyCode = code;
        break;
      }
    }
    if (companyCode) {
      acc[companyCode] = (acc[companyCode] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const dataBankCodes = ["081", "088", "436"];

  const sortedFinancialInstitutions = ALL_FINANCIAL_INSTITUTIONS.sort(
    (a, b) => {
      const aHasData = dataBankCodes.includes(a.code);
      const bHasData = dataBankCodes.includes(b.code);

      if (aHasData && !bHasData) return -1;
      if (!aHasData && bHasData) return 1;
      return 0;
    }
  );

  const getInstitutionStatus = (institution: any) => {
    const accountCount = accountCountByBank[institution.code] || 0;
    const insuranceCount = insuranceCountByCompany[institution.code] || 0;
    const totalCount = accountCount + insuranceCount;

    if (totalCount > 0) {
      return `${totalCount}개`;
    }
    return "미보유";
  };

  const getInstitutionStatusColor = (institution: any) => {
    const accountCount = accountCountByBank[institution.code] || 0;
    const insuranceCount = insuranceCountByCompany[institution.code] || 0;
    const totalCount = accountCount + insuranceCount;

    if (totalCount > 0) {
      return "text-olo dark:text-brand";
    }
    return "text-gray-400 dark:text-gray-500";
  };

  const getInstitutionImage = (code: string, type: "bank" | "insurance") => {
    if (type === "bank") {
      return BANK_IMAGE_MAP.get(code) || null;
    } else {
      return INSURANCE_IMAGE_MAP.get(code) || null;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background dark:bg-darkBg">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            자산을 불러왔어요
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            연결된 금융기관의 자산 정보를 확인할 수 있어요
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src="/hana3dIcon/hanaIcon3d_87.png"
              alt="자산 불러오기"
              className="w-20 h-20 object-contain"
            />
            <CheckCircle className="w-6 h-6 text-green-500 absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full" />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {sortedFinancialInstitutions.map((institution) => {
            const status = getInstitutionStatus(institution);
            const statusColor = getInstitutionStatusColor(institution);
            const institutionImage = getInstitutionImage(
              institution.code,
              institution.type
            );

            return (
              <div
                key={institution.code}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {institutionImage ? (
                        <img
                          src={institutionImage}
                          alt={institution.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {institution.name}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${statusColor}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent">
        <button
          className="w-full py-4 rounded-lg font-bold text-lg bg-brand text-white hover:bg-brand/90 transition-colors"
          onClick={() => history.push("linking")}
        >
          연결하기
        </button>
      </div>
    </div>
  );
}

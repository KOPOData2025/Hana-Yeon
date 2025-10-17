export const INSURANCE_CODE_MAP = new Map<string, string>([
  ["436", "DB생명보험"],
  ["443", "교보생명"],
  ["600", "한화생명"],
]);

export const INSURANCE_IMAGE_MAP = new Map<string, string>([
  [
    "436",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/db-darkmode.png",
  ],
  [
    "443",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kyobolife-darkmode.png",
  ],
  [
    "600",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/hanhwa-darkmode.png",
  ],
]);

export const INSURANCE_TYPE_CODE_MAP = new Map<string, string>([
  ["01", "종신보험"],
  ["02", "정기보험"],
  ["03", "질병(건강)보험"],
  ["04", "상해보험"],
  ["05", "암보험"],
  ["06", "간병(요양)보험"],
  ["07", "어린이보험"],
  ["08", "치아보험"],
  ["09", "연금저축보험"],
  ["10", "연금보험"],
  ["11", "저축보험(양로보험 포함)"],
  ["12", "교육보험"],
  ["13", "운전자보험"],
  ["14", "여행자보험"],
  ["15", "골프보험"],
  ["16", "실손의료보험"],
  ["17", "자동차보험"],
  ["18", "화재/재물보험"],
  ["19", "배상책임보험"],
  ["20", "보증(신용)보험"],
  ["21", "펫보험"],
  ["22", "종합보장보험"],
  ["99", "기타보험"],
]);

export const INSURANCE_STATUS_MAP = new Map<string, string>([
  ["02", "유효"],
  ["04", "중기"],
  ["05", "만기"],
  ["06", "소멸"],
]);

// 연령대별 월평균 보험료 (원)
export const AGE_GROUP_AVERAGE_PREMIUM = new Map<string, number>([
  ["20", 144000], // 20대
  ["30", 148000], // 30대
  ["40", 221000], // 40대
  ["50", 396000], // 50대
  ["60", 396000], // 60대 이상
]);

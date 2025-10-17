import { INSURANCE_CODE_MAP } from "./insurance";

export const BANK_CODE_MAP = new Map<string, string>([
  // ["002", "KDB 산업은행"],
  ["081", "하나은행"],
  ["088", "신한은행"],
  ["004", "KB 국민은행"],
  ["003", "IBK 기업은행"],
  ["090", "카카오뱅크"],
  ["092", "토스뱅크"],
  ["011", "NH 농협은행"],
  ["020", "우리은행"],
  ["023", "SC 제일은행"],
  ["007", "수협은행"],
  ["027", "한국씨티은행"],
  ["031", "아이엠뱅크"],
  // ["032", "부산은행"],
  // ["034", "광주은행"],
  // ["035", "제주은행"],
  // ["037", "전북은행"],
  ["039", "경남은행"],
  ["089", "케이뱅크"],
  // ["097", "오픈은행"],
  // 증권사
  ["218", "KB증권"],
  ["227", "다올투자증권"],
  ["238", "미래에셋증권"],
  ["240", "삼성증권"],
  ["243", "한국투자증권"],
  ["247", "NH투자증권"],
  ["261", "교보증권"],
  ["262", "하이투자증권"],
  ["263", "현대차증권"],
  ["264", "키움증권"],
  ["265", "LS증권"],
  ["266", "SK증권"],
  ["267", "대신증권"],
  ["269", "한화투자증권"],
  ["270", "하나증권"],
  ["271", "토스증권"],
  ["278", "신한투자증권"],
  ["279", "DB금융투자"],
  ["280", "유진투자증권"],
  ["287", "메리츠증권"],
  ["296", "오픈증권"],
]);

export const STOCK_BANK_CODE_MAP = new Map<string, string>([
  // 증권사
  ["218", "KB증권"],
  ["227", "다올투자증권"],
  ["238", "미래에셋증권"],
  ["240", "삼성증권"],
  ["243", "한국투자증권"],
  ["247", "NH투자증권"],
  ["261", "교보증권"],
  ["262", "하이투자증권"],
  ["263", "현대차증권"],
  ["264", "키움증권"],
  ["265", "LS증권"],
  ["266", "SK증권"],
  ["267", "대신증권"],
  ["269", "한화투자증권"],
  ["270", "하나증권"],
  ["271", "토스증권"],
  ["278", "신한투자증권"],
  ["279", "DB금융투자"],
  ["280", "유진투자증권"],
  ["287", "메리츠증권"],
  ["296", "오픈증권"],
]);

export const BANK_IMAGE_MAP = new Map<string, string>([
  ["002", "KDB 산업은행"],
  [
    "003",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/ibk-darkmode.png",
  ],
  [
    "004",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kb-darkmode.png",
  ],
  [
    "218",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kb-darkmode.png",
  ],
  [
    "007",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/suhyup-darkmode.png",
  ],
  [
    "011",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/nh-darkmode.png",
  ],
  [
    "020",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/woori-darkmode.png",
  ],
  [
    "023",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/sc-darkmode.png",
  ],
  [
    "027",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/citi-darkmode.png",
  ],
  [
    "031",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/imbank-darkmode.png",
  ],
  ["032", "부산은행"],
  ["034", "광주은행"],
  ["035", "제주은행"],
  ["037", "전북은행"],
  [
    "039",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/bnk-kyongnam-darkmode.png",
  ],
  [
    "081",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/hana-darkmode.png",
  ],
  [
    "088",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/shinhan-darkmode.png",
  ],
  [
    "089",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kbank-darkmode.png",
  ],
  [
    "090",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kakaobank-darkmode.png",
  ],
  [
    "092",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/toss-darkmode.png",
  ],
  ["097", "오픈은행"],
  [
    "436",
    "https://cdn.banksalad.com/cdn-cgi/image/width=96,metadata=none,format=webp,onerror=redirect/https://cdn.banksalad.com/graphic/color/logo/circle/kyobolife-darkmode.png",
  ],
]);

export const BANK_COLORS = {
  "081": {
    // 하나은행
    primary: "#009178", // 메인 그린
    secondary: "#00B2A0",
    gradient: "from-teal-700 to-teal-500",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
  "004": {
    // 국민은행
    primary: "#ffce0b", // 메인 옐로우
    secondary: "#877a66", // 다크 골드
    gradient: "from-yellow-500 to-yellow-400",
    text: "text-gray-900",
    icon: "bg-gray-900 bg-opacity-10",
  },
  "218": {
    // KB증권
    primary: "#ffce0b", // 메인 옐로우
    secondary: "#877a66", // 다크 골드
    gradient: "from-yellow-500 to-yellow-400",
    text: "text-gray-900",
    icon: "bg-gray-900 bg-opacity-10",
  },
  "088": {
    // 신한은행
    primary: "#0046ff",
    secondary: "#0080FF",
    gradient: "from-blue-900 to-blue-700",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
  "011": {
    // 농협은행
    primary: "#00AC47",
    secondary: "#32CD32",
    gradient: "from-green-700 to-yellow-400",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
  "090": {
    // 카카오뱅크
    primary: "#FEE500", // 카카오 메인 옐로우
    secondary: "#000000", // 로고 블랙
    gradient: "from-yellow-400 to-yellow-300",
    text: "text-black",
    icon: "bg-black bg-opacity-10",
  },
  "092": {
    // 토스뱅크
    primary: "#0064FF", // 토스 블루
    secondary: "#338FFF",
    background: "bg-blue-600",
    gradient: "from-blue-600 to-blue-400",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
  "003": {
    // 기업은행
    primary: "#1C3564", // 딥 블루
    secondary: "#0072CE", // 메인 블루
    background: "bg-blue-800",
    gradient: "from-blue-800 to-blue-600",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
  "020": {
    // 우리은행
    primary: "#0067AC", // 우리 메인 블루
    secondary: "#00A0DF",
    background: "bg-sky-700",
    gradient: "from-sky-700 to-sky-500",
    text: "text-white",
    icon: "bg-white bg-opacity-20",
  },
} as const;

export const ALL_FINANCIAL_INSTITUTIONS = [
  ...Array.from(BANK_CODE_MAP.entries()).map(([code, name]) => ({
    code,
    name,
    type: "bank" as const,
  })),
  ...Array.from(INSURANCE_CODE_MAP.entries()).map(([code, name]) => ({
    code,
    name,
    type: "insurance" as const,
  })),
];

import {
  Home,
  CandlestickChart,
  PiggyBank,
  Shield,
  CircleDollarSign,
} from "lucide-react";
import { PATH } from "./path";

export const navPath = {
  [PATH.HOME]: "홈",
  [PATH.PENSION]: "연금",
  [PATH.STOCK]: "주식",
  [PATH.VIRTUAL_CURRENCY]: "가상화폐",
  [PATH.INSURANCE]: "보험",
  // [PATH.PREDICT_NATIONAL_PENSION]: "국민연금 예상수령액",
  // [PATH.COMPARE_PENSION]: "내 또래와 연금 비교",
  [PATH.PORTFOLIO]: "자산진단",
  [PATH.SHOP]: "기프티샵",
} as const;

export const navItems = [
  { name: "홈", href: PATH.HOME, icon: Home, subPath: [] },
  {
    name: "연금",
    href: PATH.PENSION,
    icon: PiggyBank,
    subPath: [PATH.PREDICT_NATIONAL_PENSION, PATH.COMPARE_PENSION],
  },
  {
    name: "주식",
    href: PATH.STOCK,
    icon: CandlestickChart,
    subPath: [PATH.SURVEY],
  },
  {
    name: "가상화폐",
    href: PATH.VIRTUAL_CURRENCY,
    icon: CircleDollarSign,
    subPath: [],
  },
  {
    name: "보험",
    href: PATH.INSURANCE,
    icon: Shield,
    subPath: [],
  },
] as const;

export const pageTitles: { [key: string]: string } = {
  "/": "금융 요약",
  "/signup": "",
  "/signin": "",
  "/stock": "주식",
  "/pension": "연금",
  "/virtual-currency": "가상화폐",
  "/insurance": "보험",
  "/survey": "투자성향 진단",
  "/stocks": "주식",
  "/predict-national-pension": "국민연금 예상수령액",
  "/compare-pension": "내 또래와 연금 비교",
  "/ai-chat": "챗봇",
  "/mydata": "",
  "/portfolio": "AI 자산진단",
  "/make-pension-saving": "연금저축 계좌 개설",
} as const;

export const withOutLayout = ["/", "/signin", "/signup"];
export const INFLATION_RATE = 0.025;

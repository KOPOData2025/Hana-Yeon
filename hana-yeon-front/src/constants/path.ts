export const PATH = {
  HOME: "/",
  PENSION: "/pension",
  STOCK: "/stock",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  MY_DATA: "/mydata",
  MY_DATA_COMPLETE: "/mydata-complete",
  GO_MAKE_HANA: "/goMakeHana",
  ACCOUNT_DETAIL: "/account",
  STOCK_ACCOUNT_DETAIL: "/stock-account",
  IRP_ACCOUNT_DETAIL: "/irp-account",
  SEND_MONEY: "/send-money",
  SEND_MONEY_SELF: "/send-money-self",
  INSURANCE: "/insurance",
  IRP_EVENT: "/irp-event",
  MAKE_HANA_IRP: "/make-hana-irp",
  SURVEY: "/survey",
  SURVEY_RESULT: "/survey-result",
  PREDICT_NATIONAL_PENSION: "/predict-national-pension",
  COMPARE_PENSION: "/compare-pension",
  AI_CHAT: "/ai-chat",
  VIRTUAL_CURRENCY: "/virtual-currency",
  PORTFOLIO: "/portfolio",
  SHOP: "/shop",
  MAKE_PENSION_SAVING: "/make-pension-saving",
} as const;

export const publicRoutes = ["/signin", "/signup", "/shop"];

export const HANA1Q_APP_SCHEME = "hanapush://" as const;
export const HANA1Q_APP_STORE =
  "https://apps.apple.com/kr/app/%ED%95%98%EB%82%98%EC%9D%80%ED%96%89-%ED%95%98%EB%82%98%EC%9B%90%ED%91%90%EB%8A%94-%EC%A6%90%EA%B1%B0%EC%9A%B4-%ED%98%9C%ED%83%9D%EC%9D%B4-%EA%B0%80%EB%93%9D%ED%95%9C-%EC%9D%80%ED%96%89-%EC%95%B1/id1362508015" as const;
export const HANA1Q_STOCK_APP_SCHEME = "Hana1QNext://" as const;

export const HANA1Q_LIFE_APP_SCHEME =
  "https://apps.apple.com/kr/app/%ED%95%98%EB%82%98%EC%9B%90%ED%81%90-%EB%9D%BC%EC%9D%B4%ED%94%84-%ED%95%98%EB%82%98%EC%83%9D%EB%AA%85/id1468237732" as const;

export const HANA_BANK_WEB = "https://www.kebhana.com/nftf2/index.do";
export const HANA_STOCK_WEB =
  "https://www.hanaw.com/main/customer/customer/CS_050100_M.cmd";
export const HANA_INSURANCE_WEB = "https://www.hanalife.co.kr/home/main.do";

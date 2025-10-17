export const SIGNUP = "/api/user/signup" as const;
export const LOGIN = "/api/user/login" as const;
export const LOGOUT = "/api/user/logout" as const;
export const GET_ME = "/api/user/me" as const;
export const SEARCH_ALL_ASSETS = "/api/asset/searchAll" as const;
export const REGISTER_ACCOUNT = "/api/account/register" as const;
export const REGISTER_INSURANCE = "/api/insurance/register" as const;
export const GET_ALL_ACCOUNTS = "/api/account/all" as const;
export const GET_ALL_INSURANCE = "/api/insurance/all" as const;
export const GET_PEER_AVERAGE = (age: number) =>
  `/api/pension/predict-average?age=${age}` as const;
export const GET_PEER_MONTHLY_AVERAGE = (age: number) =>
  `/api/pension/peer-monthly-average?age=${age}` as const;
export const GET_PREDICT_NATIONAL_PENSION = (monthlyContribution: number) =>
  `/api/pension/predict-national-pension?monthlyContribution=${monthlyContribution}` as const;
export const GET_PORTFOLIO = "/api/asset/portfolio" as const;
export const GET_VIRTUAL_CURRENCY = "/api/upbit/virtual" as const;
export const GET_UPBIT_USER = "/api/upbit/keys" as const;
export const REGISTER_UPBIT_KEYS = "/api/upbit/keys" as const;
export const GET_TODAY_QUIZ = "/api/quiz/today" as const;
export const CHECK_QUIZ_ANSWER = "/api/quiz/check" as const;
export const GET_USER_MISSIONS = "/api/user/missions" as const;
export const GET_ACCOUNT_DETAIL = (accountNum: string) =>
  `/api/account/transaction/${accountNum}` as const;
export const SEND_MONEY = "/api/account/transfer" as const;
export const POST_VOC = "/api/voc" as const;
export const POST_INVEST_TYPE = "/api/stock/invest-type" as const;
export const BUY_PRODUCT = "/api/shop/buy" as const;
export const CREATE_PENSION_ACCOUNT = "/api/account/create" as const;
// 제 3인증 기관
export const SEND_SMS = `${
  import.meta.env.VITE_THIRD_PARTY_API_BASE_URL
}/api/v1/auth/send-sms` as const;
export const CERTIFY_USER_CI = `${
  import.meta.env.VITE_THIRD_PARTY_API_BASE_URL
}/api/v1/auth/certify-user-ci` as const;

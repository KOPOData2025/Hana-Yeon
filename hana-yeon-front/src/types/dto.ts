import type { AssetSummary, PortfolioAnalysis } from "./analysis";

export interface SendSmsRequest {
  userName: string;
  userPhone: string;
  userNum: string;
}

export interface SendSmsResponse {
  success: boolean;
  message: string;
  userCi: string | null;
}

export interface CertifyUserCiRequest {
  userName: string;
  userPhone: string;
  userNum: string;
  verifyCode: string;
}

export interface CertifyUserCiResponse extends SendSmsResponse {}

export interface SignUpRequest {
  userName: string;
  phoneNo: string;
  gender: string;
  birthDate: string;
  userCi: string;
  pin: string;
}

export interface SignUpResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface SignInRequest {
  phoneNo: string;
  pin: string;
}

export interface SignInResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    userId: number;
    userName: string;
  };
}

export interface LogoutResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface GetMeResponse {
  userId: number;
  userName: string;
  phoneNo: string;
  gender: string;
  birthDate: string;
  userStatus: string;
  quizPoint: number;
  investType: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// 자산 조회 관련 타입
export interface AccountInfo {
  bankcode: string;
  bankName: string;
  productName: string;
  productSubName: string;
  accountType: number;
  accountNum: string;
  accountIssueDate: string;
  lastTranDate: string;
}

export interface InsuranceInfo {
  bankCodeStd: string;
  insuNum: number;
  productName: string;
  insuType: string;
  insuranceCompany: string;
}

export interface AssetSearchResponse {
  totalLength: number;
  accountCount: number;
  insuranceCount: number;
  accountList: AccountInfo[];
  insuranceList: InsuranceInfo[];
}

export interface RegisterAccountRequest {
  accountList: {
    bankcode: string;
    bankName: string;
    productName: string;
    productSubName: string;
    accountType: string | number;
    accountNum: string;
    accountSeq: string;
    accountIssueDate: string;
    lastTranDate: string;
    dormancyYn: string;
  }[];
}

export interface RegisterAccountResponse {
  status: number;
  success: boolean;
  message: string;
  results: {
    bankcode: string;
    accountNum: string;
    fintechUseNum: string;
    rspCode: string;
    rspMessage: string;
    success: boolean;
  }[];
  successCount: number;
  failureCount: number;
}

// 보험 등록 관련 타입
export interface RegisterInsuranceRequest {
  insuranceList: {
    bankCodeStd: string;
    insuNum: number;
    productName: string;
    insuType: string;
    insuranceCompany: string;
  }[];
}

export interface RegisterInsuranceResponse {
  status: number;
  success: boolean;
  message: string;
  results: {
    bankCodeStd: string;
    insuNum: number;
    productName: string;
    insuType: string;
    insuranceCompany: string;
  }[];
  successCount: number;
  failureCount: number;
}

// 전체 계좌 조회 관련 타입
export interface AccountDto {
  fintechUseNum: string;
  bankCodeStd: string;
  bankName: string;
  accountNum: string;
  accountType: string;
  accountTypeName: string;
  accountAlias: string | null;
  accountHolderName: string;
  isMainAccount: boolean | null;
  accountState: string;
  productName: string;
  balanceAmt: string;
  accountIssueDate: string;
  returnRate?: number | null;
  riskLevel?: number | null;
}

export type GetAllAccountsResponse = AccountDto[];

// 계좌 상세 조회 (거래내역) 관련 타입
export interface TransactionDto {
  tranDate: string;
  tranTime: string;
  inoutType: string;
  tranType: string;
  printContent: string;
  tranAmt: string;
  afterBalanceAmt: string;
  branchName: string;
}

export interface GetAccountTransactionResponse {
  success: boolean;
  message: string;
  data: {
    bankName: string;
    accountNum: string;
    balanceAmt: string;
    productName: string;
    pageRecordCnt: number;
    nextPageYn: "Y" | "N";
    beforInquiryTraceInfo: string;
    resList: TransactionDto[];
  };
}

// 계좌 이체 관련 타입
export interface TransferRequest {
  tranAmt: string;
  dpsPrintContent: string;
  recvClientName: string;
  recvClientBankCode: string;
  recvClientAccountNum: string;
  transferPurpose: string;
  wdBankCodeStd: string;
  wdAccountNum: string;
}

export interface TransferResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface GetAllInsuranceResponse {
  insuList: {
    institutionCode: string;
    insuNum: string;
    prodName: string;
    insuType: string;
    insuranceCompany: string;
    insuStatus: string;
    issueDate: string;
    expDate: string;
    monthlyPremium: number;
  }[];
}

export interface GetPeerAverageResponse {
  targetAgeGroup: string;
  dataYear: string;
  averageTotalPension: number;
  nationalPension: number;
  retirementPension: number;
  personalPension: number;
}

export interface GetPeerMonthlyAverageResponse {
  userAge: number;
  dataYear: string;
  peerAgeGroup: string;
  averageTotalContribution: number;
  nationalPension: number;
  occupationalPension: number;
  personalPension: number;
  totalAccumulatedRetirementPensionAmount: number;
  maleAccumulatedRetirementPension: number;
  femaleAccumulatedRetirementPension: number;
}

export interface UpbitAccount {
  currency: string; // 통화
  balance: string; // 주문가능 금액/수량
  locked: string; // 주문 중 묶여있는 금액/수량
  avg_buy_price: string; // 매수평균가
  avg_buy_price_modified: boolean; // 매수평균가 수정 여부
  unit_currency: string; // 평단가 기준 화폐
}

// 가상화폐 API 응답 타입
export interface VirtualCurrencyResponse {
  requiresKeyRegistration: boolean;
  accounts?: UpbitAccount[];
  message?: string;
}

export interface UpbitUser {
  upbitUserId: number;
  userId: number;
  accessKey: string; // 마스킹된 키
  secretKey: string; // 마스킹된 키
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPredictNationalPensionResponse {
  monthlyContribution: number;
  pensionAmountsByPeriod: {
    [key: string]: number;
  };
  nationalAverageIncome: number;
  personalIncomeCap: number;
}

export interface Ticker {
  code: string;
  trade_price: number;
  change: "RISE" | "FALL" | "EVEN";
  signed_change_price: number;
  animation?: "flash-red" | "flash-blue";
}

export interface PortfolioResponse {
  portfolioAnalysis: PortfolioAnalysis;
  recommendations?: string[];
  hanaProducts?: string[];
  assetSummary?: AssetSummary;
}

// 퀴즈 관련 타입
export interface QuizOption {
  optionId: number;
  optionText: string;
}

export interface TodayQuizResponse {
  quizId: number;
  question: string;
  options: QuizOption[];
  isAlreadyAnswered: boolean;
  selectedAnswer?: string;
  wasCorrect?: boolean;
}

export interface CheckQuizRequest {
  quizId: number;
  selectedAnswer: string;
}

export interface CheckQuizResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  earnedPoint: number;
  totalQuizPoint: number;
}

export interface GetAccountDetailResponse {
  bankName: string;
  accountNum: string;
  balanceAmt: string;
  productName: string;
  pageRecordCnt: number;
  nextPageYn: "N" | "Y";
  beforInquiryTraceInfo: string | null;
  resList: TransactionDto[];
}

export interface SendMoneyRequestBody {
  tranAmt: string;
  dpsPrintContent: string;
  recvClientName: string;
  recvClientBankCode: string;
  recvClientAccountNum: string;
  transferPurpose: "TR" | "WD" | "RC" | "ST";
  wdBankCodeStd: string;
  wdAccountNum: string;
}

export interface SendMoneyResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface VocRequest {
  content: string;
}

export interface VocResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface PostInvestTypeRequest {
  investType: string;
}

export interface PostInvestTypeResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    investType: string;
    message: string;
  };
}

export interface BuyProductRequest {
  productId: string;
  point: number;
}

export interface BuyProductResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface CreatePensionAccountRequest {
  productName: string;
  accountType: string;
  returnRate: number;
  riskLevel: number;
}

export interface CreatePensionAccountResponse {
  accountNum: string;
  bankCodeStd: string;
  bankName: string;
  productName: string;
  accountType: string;
  accountIssueDate: string;
}
export interface Mission {
  id: number;
  title: string;
  reward: number;
  isCompleted: boolean;
}

export interface GetUserMissionsResponse {
  missions: Mission[];
}

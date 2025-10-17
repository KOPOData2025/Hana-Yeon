import type { AccountInfo, InsuranceInfo } from "./dto";

export type TSignUpFunnelSteps = {
  AgreeToTerms: {
    agreedTerms?: boolean[];
  };
  CombinedInput: {
    agreedTerms: boolean[];
    userName?: string;
    ssn1?: string;
    ssn2?: string;
    phone?: string;
  };
  SetSimplePin: {
    agreedTerms: boolean[];
    userName: string;
    ssn1: string;
    ssn2: string;
    phone: string;
    simplePin?: string;
    isError?: boolean;
  };
  SetSimplePinConfirm: {
    agreedTerms: boolean[];
    userName: string;
    ssn1: string;
    ssn2: string;
    phone: string;
    simplePin: string;
    simplePinConfirm?: string;
  };
};

export type TComparePensionFunnelSteps = {
  intro: {};
  loading: {};
  pensionInfo: {};
  analyzing: {};
  result: {};
};

export type TMyDataFunnelSteps = {
  agreeTerms: {};
  myDataUserInput: {};
  fetchMyData: {
    accountList: AccountInfo[];
    insuranceList: InsuranceInfo[];
  };
  showDataToLink: {};
  linking: {};
  linkingComplete: {};
};

export type TSendMoneyFunnelSteps = {
  setOpponentAccount: {
    selfBankCode: string;
    selfAccount: string;
    opponentAccount?: string;
    bank?: string;
  };
  setAmount: {
    selfBankCode: string;
    selfAccount: string;
    opponentBankCode: string;
    opponentAccount: string;
    amount?: string;
  };
  send: {
    selfBankCode: string;
    selfAccount: string;
    opponentBankCode: string;
    opponentAccount: string;
    amount: string;
  };
};

export type TPensionSavingFunnelSteps = {
  selectType: {
    selectedType?: "discretionary" | "trust";
  };
  showInfo: {
    selectedType: "discretionary" | "trust";
  };
  agreeInfo: {
    selectedType: "discretionary" | "trust";
  };
  inputInfo: {
    selectedType: "discretionary" | "trust";
    allAgreed: boolean;
  };
  complete: {
    selectedType: "discretionary" | "trust";
    allAgreed: boolean;
    receivingAge: number;
    pensionReceiveAccount: string;
    accountName: string;
    createdAccountNum: string;
  };
};

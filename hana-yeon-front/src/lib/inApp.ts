import {
  HANA1Q_APP_SCHEME,
  HANA1Q_APP_STORE,
  HANA1Q_LIFE_APP_SCHEME,
  HANA1Q_STOCK_APP_SCHEME,
  HANA_BANK_WEB,
  HANA_STOCK_WEB,
  HANA_INSURANCE_WEB,
} from "@/constants";

export const getSignUpCurrentStep = (step: string) => {
  switch (step) {
    case "AgreeToTerms":
      return 1;
    case "CombinedInput":
      return 2;
    case "SetSimplePin":
      return 3;
    case "SetSimplePinConfirm":
      return 3;
    default:
      return 1;
  }
};

export const getMyDataCurrentStep = (step: string) => {
  switch (step) {
    case "agreeTerms":
      return 1;
    case "myDataUserInput":
      return 2;
    default:
      return 3;
  }
};

export const getSignUpStepTitle = (step: string) => {
  switch (step) {
    case "AgreeToTerms":
      return "약관에 동의해주세요.";
    case "CombinedInput":
      return "개인정보를 입력해주세요.";
    case "SetSimplePin":
      return "간편비밀번호를 설정해주세요.";
    case "SetSimplePinConfirm":
      return "간편비밀번호를 설정해주세요.";
    default:
      return "";
  }
};

export const getMyDataStepTitle = (step: string) => {
  switch (step) {
    case "agreeTerms":
      return "약관에 동의해주세요.";
    case "myDataUserInput":
      return "개인정보를 입력해주세요.";
    default:
      return "";
  }
};

export const openHana1Q = () => (window.location.href = HANA1Q_APP_SCHEME);
export const goHanaBankWeb = () => window.open(HANA_BANK_WEB, "_blank");

export const openHana1QStock = () =>
  (window.location.href = HANA1Q_STOCK_APP_SCHEME);
export const goHanaStockWeb = () => window.open(HANA_STOCK_WEB, "_blank");

export const goHanaInsuranceWeb = () =>
  window.open(HANA_INSURANCE_WEB, "_blank");
export const openHanaLife = () =>
  (window.location.href = HANA1Q_LIFE_APP_SCHEME);

export const openHana1QAppStore = () =>
  (window.location.href = HANA1Q_APP_STORE);

export const getUserAgeGroup = (age: number) => {
  if (age < 30) return "20";
  if (age < 40) return "30";
  if (age < 50) return "40";
  if (age < 60) return "50";
  return "60";
};

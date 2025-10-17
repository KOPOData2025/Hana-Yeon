import { clsx, type ClassValue } from "clsx";
import { enqueueSnackbar } from "notistack";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (value: number, unit = "") =>
  new Intl.NumberFormat("ko-KR").format(value) + unit;

export const formatCurrency10000 = (value: number, unit = "만원") => {
  const num = Math.round(value / 10000);
  return num.toLocaleString("ko-KR") + unit;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatBalance = (balance: number) => {
  return balance.toLocaleString("ko-KR") + "원";
};
export const numberToKorean = (number: number) => {
  let inputNumber = number < 0 ? 0 : number;
  let unitWords = ["", "만", "억"];
  let splitUnit = 10000;
  let splitCount = unitWords.length;
  let resultArray = [];
  let resultString = "";

  for (let i = 0; i < splitCount; i++) {
    let unitResult =
      (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }
  for (let i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString = String(resultArray[i]) + unitWords[i] + resultString;
  }
  return resultString;
};

export const formatNumberWithComma = (value: string) => {
  if (!value) return "";
  return Number(value).toLocaleString();
};

export const formatDateToMD = (dateString: string) => {
  if (!dateString || dateString.length !== 8) return "";

  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);

  return `${month}.${day}`;
};

export const formatDateToMDY = (dateString: string) => {
  if (!dateString || dateString.length !== 8) return "";

  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);

  return `${year}.${month}.${day}`;
};

export const formatTimeToHHMM = (
  timeString: string,
  includeSeconds: boolean = false
) => {
  if (!timeString || timeString.length !== 6) return "";

  const hours = parseInt(timeString.substring(0, 2), 10);
  const minutes = parseInt(timeString.substring(2, 4), 10);
  const seconds = parseInt(timeString.substring(4, 6), 10);

  const kstHours = (hours + 9) % 24;

  const formattedHours = kstHours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (includeSeconds) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedHours}:${formattedMinutes}`;
};

export const getBirthDate = (ssn1: string) => {
  const birthDate = `${
    ssn1.substring(0, 2) > "30" ? "19" : "20"
  }${ssn1.substring(0, 2)}-${ssn1.substring(2, 4)}-${ssn1.substring(4, 6)}`;

  return birthDate;
};

export const getGenderFromSSN = (ssn2: string) =>
  ssn2.charAt(0) === "1" || ssn2.charAt(0) === "3" ? "M" : "F";

export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const calculateAgeFromYYYYMMDD = (birthdateStr: string): number => {
  const [year, month, day] = birthdateStr.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // 생일이 아직 지나지 않았으면 1살 빼기
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const copyToClipboard = (value?: string) => {
  try {
    const el = document.createElement("textarea");
    el.value = value || "";
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(el);
    enqueueSnackbar("계좌번호를 복사했어요!", { variant: "success" });
    return true;
  } catch (e) {
    console.log("링크 복사 실패", e);
    return false;
  }
};

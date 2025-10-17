import { useState, useEffect } from "react";
import {
  openHana1Q,
  openHana1QStock,
  openHanaLife,
  goHanaBankWeb,
  goHanaStockWeb,
  goHanaInsuranceWeb,
} from "@/lib/inApp";

const HANA_BANK_WEB = "https://www.kebhana.com/nftf2/index.do";
const HANA_STOCK_WEB =
  "https://www.hanaw.com/main/customer/customer/CS_050100_M.cmd";
const HANA_INSURANCE_WEB = "https://www.hanalife.co.kr/home/main.do";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));
  }, []);

  const goHanaBank = () => {
    if (isMobile) {
      openHana1Q();
    } else {
      goHanaBankWeb();
    }
  };

  const goHanaStock = () => {
    if (isMobile) {
      openHana1QStock();
    } else {
      goHanaStockWeb();
    }
  };

  const goHanaInsurance = () => {
    if (isMobile) {
      openHanaLife();
    } else {
      goHanaInsuranceWeb();
    }
  };

  return {
    isMobile,
    goHanaBank,
    goHanaStock,
    goHanaInsurance,
  };
};

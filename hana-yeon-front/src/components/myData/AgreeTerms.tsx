import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "lucide-react";
import { useAuthStore } from "@/store";

interface AgreeTermsProps {
  history: any;
}

export default function AgreeTerms({ history }: AgreeTermsProps) {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [agreements, setAgreements] = useState({
    personalInfoCollection: false,
    personalInfoProvision: false,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { userInfo } = useAuthStore();

  // 스크롤 위치 확인
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isAtEnd = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유
      setIsScrolledToEnd(isAtEnd);
    }
  };

  // 화면 높이만큼 스크롤
  const scrollDown = () => {
    if (scrollContainerRef.current) {
      const currentScrollTop = scrollContainerRef.current.scrollTop;
      const viewportHeight = window.innerHeight;
      scrollContainerRef.current.scrollTo({
        top: currentScrollTop + viewportHeight,
        behavior: "smooth",
      });
    }
  };

  const handleRequiredAgree = () => {
    setAgreements({
      personalInfoCollection: true,
      personalInfoProvision: true,
    });
    setIsDrawerOpen(true);
  };

  const toggleAgreement = (
    type: "personalInfoCollection" | "personalInfoProvision"
  ) => {
    setAgreements((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition(); // 초기 체크
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 px-4 overflow-y-auto">
        {/* 메인 제목 */}
        <div className="pt-4 mb-6">
          <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {userInfo?.userName ?? "고객"}님의 정보를
          </h1>
          <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            확인하기 위한 동의문이에요
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            상세정보 전송요구 및
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            개인신용정보 수집·이용
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            하나연(緣)은 「신용정보의 이용 및 보호에 관한 법률」, 「개인정보
            보호법」등 관련 법령에 따라 개인신용용보를 처리해요.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
            정보를 보내는 곳
          </h3>
          <p className="text-gray-700 dark:text-gray-300">220개 기관</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
            정보를 받는 곳
          </h3>
          <p className="text-gray-700 dark:text-gray-300">하나연(緣)</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">목적</h3>
          <p className="text-gray-600 dark:text-gray-300">
            전송요구를 통한 본인신용정보 통합조회, 데이터분석 서비스의 이용
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
            보유·이용기간
          </h3>
          <p className="text-brand">
            서비스 이용 종료, 삭제 요구시, 또는 마지막 서비스 접속일로부터 1년이
            경과한 때까지
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            전송요구 정보
          </h3>
          <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <div>
              <p className="font-medium">
                • 은행: 계좌목록, 수신계좌정보, 펀드상품정보, 대출상품정보,
                개인형IRP정보, 신탁/ISA상품정보, 선물카드정보, DB
                형태직연금정보, DC형태직연금정보, 휴면예금 정보, 적요/ 거래메모
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 카드: 카드목록, 신용카드정보, 포인트정보, 청구·결제·
                리볼빙정보, 카드대출정보, 선불카드정보, 가맹점명, 국내승인/
                국내매입 가맹점 사업자등록번호
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 증권: 계좌목록, 계좌정보, 개인형IRP정보, DB형태직연금정보,
                DC형태직연금정보, 적요/거래메모
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 포인트: 전자금융목록, 선불전자금융정보, 결제정보, 거래메모,
                가맹점명, 가맹점 사업자등록번호, 상품(구매) 분류(코드)
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 보험: 보험목록, 보험정보, 대출정보, 개인형IRP정보,
                피보험자보험정보, DB형태직연금정보, DC형태직연금정보, 휴면/
                미청구보험금 정보
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 학부금융: 대출/운용리스목록, 대출/운용리스정보
              </p>
            </div>
            <div>
              <p className="font-medium">
                • 통신사: 계약목록, 청구/결제정보, 가맹점명, 가맹점
                사업자등록번호
              </p>
            </div>
          </div>
        </div>

        {/* 추가 정보들 */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            개인식별정보(전자서명, 접근토큰, 인증서, 전송요구서) 및 위
            전송요구정보 기재 정보를 수집·이용하며 상세한 항목은
            수집·이용정보에서 확인할 수 있어요.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            금융 자산 정보를 자동으로 입수함에 한 법 ▼
          </p>
          <p className="text-brand">5년 ▼ 동안 새로운 정보를 조회할게요.</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            개인신용정보 수집·이용에 동의하지 않을 수 있어요. 하지만 필수항목
            수집· 이용에 동의하지 않으면 본인신용정보 통합조회, 데이터분석
            서비스를 이용할 수 없고, 선택항목 수집·이용에 동의하지 않으면
            선택항목에 대한 본인신용정보 통합조회, 데이터분석 서비스를 이용할 수
            없어요.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            정확한 내역 확인을 위한 동의
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            계좌 입·출금처에는 송금인/수취인명 같은 경제활동에 관련된 정보가
            포함되어 있어요. (정정·거래메모)
          </p>
        </div>

        {/* 약관 동의 체크박스들 */}
        <div className="mb-6 rounded-xl bg-white dark:bg-darkCard/95 border border-gray-200 dark:border-gray-700">
          <div
            className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => toggleAgreement("personalInfoCollection")}
          >
            <div
              className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                agreements.personalInfoCollection
                  ? "bg-brand"
                  : "border-2 border-gray-400 dark:border-gray-500"
              }`}
            >
              {agreements.personalInfoCollection && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.5 4.5L6 12L2.5 8.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              개인신용정보 수집이용 동의
            </span>
          </div>

          <div
            className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => toggleAgreement("personalInfoProvision")}
          >
            <div
              className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                agreements.personalInfoProvision
                  ? "bg-brand"
                  : "border-2 border-gray-400 dark:border-gray-500"
              }`}
            >
              {agreements.personalInfoProvision && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.5 4.5L6 12L2.5 8.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              개인신용정보 제공 동의
            </span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 pb-10">
        <button
          onClick={isScrolledToEnd ? handleRequiredAgree : scrollDown}
          className="w-full bg-olo text-white py-4 rounded-lg font-bold text-lg"
        >
          {isScrolledToEnd ? "필수 동의하기" : "아래로 스크롤하기"}
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeOut",
              }}
              className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white dark:bg-gray-800 rounded-t-xl z-50 shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  내역에서 입·출금한 곳을 볼까요?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  적요·거래메모 전송 및 수집 이용 동의
                </p>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg pt-3 pb-5 px-5 mb-6 relative">
                  <div className="w-fit bg-olo/40 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 rounded-full font-medium mb-3">
                    예시
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-gray-700 dark:text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {userInfo?.userName ?? "홍길동"}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        01:50
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-brand font-bold">30,000원</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        잔액 12,800원
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-gray-500 dark:text-gray-400 text-center font-medium text-lg hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    나중에 하기
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      history.push("myDataUserInput");
                    }}
                    className="w-full bg-olo text-white py-3 rounded-lg font-semibold text-lg hover:bg-olo/90 transition-colors"
                  >
                    동의하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronRight,
  ChevronDown,
  ArrowDown,
  X,
  Check,
  Info,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
// constants
import { AGREEMENT_TERMS } from "@/constants";

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Step3AgreeInfoProps {
  history: any;
  context: any;
}

export default function Step3AgreeInfo({
  history,
  context,
}: Step3AgreeInfoProps) {
  const [agreements, setAgreements] = useState<Record<string, boolean>>({
    all: false,
    manual: false,
    inquiry: false,
  });

  const [pdfViewerState, setPdfViewerState] = useState<{
    isOpen: boolean;
    pdfPath: string;
    agreementId: string;
    title: string;
  }>({
    isOpen: false,
    pdfPath: "",
    agreementId: "",
    title: "",
  });

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkIsScrollBottom = () => {
    if (!scrollContainerRef?.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    setIsScrolledToBottom(isBottom);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setTimeout(() => setIsScrolledToBottom(false), 300);
  };

  const scrollToBottom = () => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 3);
      setIsScrolledToBottom(false);
      scrollContainerRef.current?.scrollTo({ top: 0 });
    }
  };

  const handleNextPage = () => {
    if (!isScrolledToBottom && currentPage < numPages) {
      enqueueSnackbar("스크롤을 내려 모두 읽어주세요", {
        variant: "success",
      });
      return;
    }

    const nextPage = currentPage + 3;

    if (nextPage < numPages) {
      setCurrentPage(nextPage);
      scrollContainerRef.current?.scrollTo({ top: 0 });
      setTimeout(checkIsScrollBottom, 300);
    } else {
      closePdfViewer(true);
    }
  };

  const openPdfViewer = (
    pdfPath: string,
    agreementId: string,
    title: string
  ) => {
    setPdfViewerState({ isOpen: true, pdfPath, agreementId, title });
    setCurrentPage(1);
    setIsScrolledToBottom(false);
  };

  const closePdfViewer = (shouldCheck: boolean = false) => {
    if (shouldCheck && pdfViewerState.agreementId) {
      setAgreements((prev) => ({
        ...prev,
        [pdfViewerState.agreementId]: true,
      }));
    }
    setPdfViewerState({
      isOpen: false,
      pdfPath: "",
      agreementId: "",
      title: "",
    });
  };

  const handleAllAgreementClick = () => {
    if (!agreements.all) {
      openPdfViewer("/pdf/know_how_term.pdf", "all", "전체 동의");
    } else {
      setAgreements((prev) => ({ ...prev, all: !prev.all }));
    }
  };

  const handleManualClick = () => {
    if (!agreements.manual) {
      openPdfViewer(
        "/pdf/know_how_manual.pdf",
        "manual",
        "설명서 및 약관 내용 확인"
      );
    } else {
      setAgreements((prev) => ({ ...prev, manual: !prev.manual }));
    }
  };

  const handleInquiryToggle = () => {
    setAgreements((prev) => ({ ...prev, inquiry: !prev.inquiry }));
  };

  const isNextButtonEnabled =
    agreements.all && agreements.manual && agreements.inquiry;

  const handleNext = () => {
    if (!isNextButtonEnabled) {
      enqueueSnackbar("약관에 모두 동의해주세요", { variant: "success" });
      return;
    }
    history.push("inputInfo", { ...context, allAgreed: true });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIsScrollBottom);
      return () => container.removeEventListener("scroll", checkIsScrollBottom);
    }
  }, [pdfViewerState.isOpen]);

  useEffect(() => {
    if (!scrollContainerRef?.current) return;
    checkIsScrollBottom();
  }, [currentPage, numPages]);

  return (
    <div className="flex flex-col h-full bg-background dark:bg-darkBg">
      <div className="bg-gray-50 dark:bg-darkCard border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          행복knowhow <br />
          연금저축계좌(집합투자증권)
        </h1>
        <div className="flex justify-end items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span className="font-semibold">원금손실가능상품</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 전체 동의 섹션 */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleAllAgreementClick}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  agreements.all
                    ? "bg-olo border-olo"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {agreements.all && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                전체 동의
              </span>
            </div>
            {agreements.all ? (
              <ChevronRight className="w-5 h-5 text-olo" />
            ) : (
              <ChevronDown className="w-5 h-5 text-olo" />
            )}
          </button>

          {/* 전체 동의 하위 항목 */}
          {!agreements.all && (
            <div className="border-t border-gray-200 dark:border-gray-500">
              {AGREEMENT_TERMS.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                  </div>
                  {item.hasDetail && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 설명서 및 약관 내용 확인 */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleManualClick}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  agreements.manual
                    ? "bg-olo border-olo"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {agreements.manual && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                설명서 및 약관 내용 확인
              </span>
            </div>
            {agreements.manual ? (
              <ChevronRight className="w-5 h-5 text-olo" />
            ) : (
              <ChevronDown className="w-5 h-5 text-olo" />
            )}
          </button>

          {!agreements.manual && (
            <div className="border-t border-gray-200 dark:border-gray-500 p-4">
              <button className="w-full flex items-center gap-3 rounded-lg">
                <Check className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-left">
                  본인은 설명서/약관 교부 및 주요내용 설명확인 등 위 자료들의
                  내용을 충분히 이해하고 확인하였습니다.
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 연금한도 조회 섹션 */}
        <div className="bg-white dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleInquiryToggle}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  agreements.inquiry
                    ? "bg-olo border-olo"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {agreements.inquiry && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                연금한도 조회
              </span>
            </div>
            {agreements.inquiry ? (
              <ChevronRight className="w-5 h-5 text-olo" />
            ) : (
              <ChevronDown className="w-5 h-5 text-olo" />
            )}
          </button>

          {!agreements.inquiry && (
            <div className="border-t border-gray-200 dark:border-gray-500 p-4">
              <div className="w-full flex items-center gap-3 rounded-lg">
                <Check className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-left">
                  연금저축계좌의 계약금액/한도증복 등을 확인하기 위해 본인의 타
                  금융기관 금융정보 조회에 동의합니다.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4">
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            isNextButtonEnabled
              ? "bg-olo text-white"
              : "bg-olo/40 dark:bg-olo/50 text-gray-100 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>

      {/* PDF 뷰어 모달 */}
      {pdfViewerState.isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 pb-2 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pdfViewerState.title}
              </h2>
              <button
                onClick={() => closePdfViewer(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-end text-gray-600 dark:text-gray-400 pt-3">
              페이지{" "}
              {`${Math.ceil(currentPage / 3)} / ${Math.ceil(numPages / 3)}`}
            </div>
          </div>

          {/* PDF 내용 */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 flex justify-center p-4"
          >
            <Document
              file={pdfViewerState.pdfPath}
              onLoadSuccess={onDocumentLoadSuccess}
              className="w-full max-w-4xl"
            >
              {Array.from({ length: 3 }, (_, i) => currentPage + i)
                .filter((pageNumber) => pageNumber <= numPages)
                .map((pageNumber) => (
                  <Page
                    key={pageNumber}
                    pageNumber={pageNumber}
                    renderTextLayer
                    renderAnnotationLayer
                    width={Math.min(window.innerWidth - 32, 894)}
                    className="shadow-lg"
                  />
                ))}
            </Document>
          </div>

          {/* PDF 하단 네비게이션 */}
          <div className="relative bg-white dark:bg-gray-800 p-4 shadow-lg">
            {/* 스크롤 버튼 */}
            {!isScrolledToBottom && currentPage < numPages && (
              <button
                onClick={scrollToBottom}
                className="absolute right-5 bottom-32 w-14 h-14 z-10 rounded-full shadow-md bg-olo/70 text-white flex items-center justify-center gap-2 transition-all"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            )}

            <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
              {/* 이전 문서 버튼 */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white"
                }`}
              >
                이전문서
              </button>

              {/* 다음 문서 버튼 및 스크롤 버튼 */}
              <div className="flex flex-col gap-2 flex-1">
                <button
                  onClick={handleNextPage}
                  className="w-full py-3 rounded-lg font-semibold transition-all bg-olo text-white"
                >
                  {currentPage === numPages ? "확인" : "다음문서"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

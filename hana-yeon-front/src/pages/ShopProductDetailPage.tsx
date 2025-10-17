import { useState } from "react";
import { useParams } from "react-router-dom";
import { useInternalRouter } from "@/hooks";
import { ediyaProducts, PATH } from "@/constants";
import DialogCommon from "@/components/ui/DialogCommon";
import { useBuyProduct } from "@/hooks/api";

export default function ShopProductDetailPage() {
  const { productNum } = useParams();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { mutateAsync: buyProductMutation } = useBuyProduct();

  const router = useInternalRouter();

  if (!productNum) {
    router.push(PATH.SHOP);
    return;
  }

  const product = ediyaProducts.find(({ id }) => id === productNum);

  if (!product) {
    router.push(PATH.SHOP);
    return;
  }

  const buyProduct = async () => {
    setOpen(false);
    try {
      const { status, success } = await buyProductMutation({
        productId: product.id,
        point: product.price,
      });
      if (status === 200 && success) {
        setOpen2(true);
      }
    } catch (e: any) {
      setErrorMsg(e.response.data.message || "오류가 발생했어요");
      setOpen3(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-darkCard">
      <div className="flex justify-center py-8">
        <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-20">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {product.brandName}
        </p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-4">
          {product.productName}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/hanamoney.png" alt="하나머니" className="w-5 h-5" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-300">
              {product.price.toLocaleString()} 캐시
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            유효기간: 30일
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-3">
            [이용안내]
          </h2>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>전국 이디야커피 매장에서 사용 가능 (일부 매장 제외)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>결제 시 모바일 쿠폰을 제시해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                다른 쿠폰과 함께 사용 가능하며, 스탬프 적립 가능 (베이커리,
                빙수, RTD 등 제외)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>쿠폰은 해당 상품으로 교환 가능합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                동일 상품이 없을 경우 다른 상품으로 교환 가능하며, 차액은 별도
                결제 (낮은 가격 상품으로 교환 시 환불 불가)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>현금으로 교환 불가</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>B2B/기업 프로모션 상품은 환불 및 연장 불가</span>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-3">
            [POS사용방법]
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            제품 선택 후 복합결제 → 모바일상품권 클릭 후 바코드 스캔(or
            바코드번호 입력) → 사용 완료
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-3">
            [사용불가매장]
          </h2>
          <a
            href="https://bs.zlgoon.com/bs/bubvk/243_N"
            className="text-blue-600 dark:text-blue-400 text-sm underline block mb-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://bs.zlgoon.com/bs/bubvk/243_N
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ※본 쿠폰은 고객에게 전액 무상으로 제공되는 쿠폰입니다.
          </p>
        </div>
      </div>

      <button
        className="fixed max-w-md mx-auto bottom-0 left-0 right-0 text-lg font-bold text-gray-100 bg-olo p-4 py-5"
        onClick={() => setOpen(true)}
      >
        구매하기
      </button>

      <DialogCommon
        open={open}
        title="구매 하시겠어요?"
        type="confirm"
        btn1Text="취소"
        btn1Handler={() => setOpen(false)}
        btn2Text="확인"
        btn2Handler={buyProduct}
      ></DialogCommon>

      <DialogCommon
        open={open2}
        title="구매가 완료되었어요!"
        type="alert"
        btn1Text="확인"
        btn1Handler={() => {
          setOpen2(false);
          router.push(PATH.SHOP);
        }}
      ></DialogCommon>

      <DialogCommon
        open={open3}
        title={errorMsg}
        type="alert"
        btn1Text="확인"
        btn1Handler={() => {
          setOpen3(false);
          router.push(PATH.SHOP);
        }}
      ></DialogCommon>
    </div>
  );
}

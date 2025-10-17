// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
// constants
import { PATH } from "@/constants";
import { sendMoneyStatus } from "@/constants/sendMoneyStatus";
// components
import Button from "@/components/ui/Button";

function Success() {
  const router = useInternalRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full mt-32">
      <img src={sendMoneyStatus.success.src} className="w-44 h-44" />
      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-4">
        {sendMoneyStatus.success.text}
      </span>
      <Button
        className="absolute left-6 right-6 bottom-20 h-14"
        onClick={() => router.push(PATH.HOME)}
      >
        확인
      </Button>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-32">
      <img src={sendMoneyStatus.loading.src} className="w-44" />
      <span className="text-lg font-semibold text-gray-600 dark:text-gray-200 mt-4">
        {sendMoneyStatus.loading.text}
      </span>
    </div>
  );
}

function Error({ errorMessage }: { errorMessage: string }) {
  const router = useInternalRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full mt-32">
      <img src={sendMoneyStatus.error.src} />
      <span className="text-lg font-semibold text-gray-600 dark:text-gray-200 mt-4">
        {errorMessage}
      </span>
      <Button
        className="absolute left-6 right-6 bottom-20 p-7 text-lg"
        onClick={() => router.push(PATH.HOME)}
      >
        확인
      </Button>
    </div>
  );
}

export const SendMoneyResult = {
  Success,
  Loading,
  Error,
};

import { Spacing, Top, colors, Text } from "tosslib";
import { useInternalRouter } from "@/hooks";
import { PATH } from "@/constants";
import Button from "@/components/ui/Button";

interface RenderFallbackProps<ErrorType extends Error = Error> {
  error: ErrorType;
  reset: () => void;
}

export default function GlobalErrorFallback({
  error,
  reset,
}: RenderFallbackProps) {
  const router = useInternalRouter();
  const isAuthError =
    error.name === "AuthenticationError" ||
    error.message.includes("accessToken") ||
    error.message.includes("인증") ||
    error.message.includes("401") ||
    error.message.toLowerCase().includes("unauthorized");

  const handleRetry = () => {
    reset();
    router.replace(PATH.HOME);
  };

  return (
    <div className="flex max-w-md mx-auto bg-background dark:bg-darkBg h-screen flex-col items-center justify-center gap-4 px-6">
      <Top.TitleParagraph color={colors.grey900}>
        {isAuthError ? "로그인이 필요해요" : "오류가 발생했어요"}
      </Top.TitleParagraph>
      <Text fontSize={16} color={colors.grey900}>
        {isAuthError ? "다시 로그인해주세요" : "일시적인 문제가 발생했어요"}
      </Text>
      <Text fontSize={14} color={colors.grey600}>
        {error.message}
      </Text>
      <Spacing size={4} />
      <Button onClick={handleRetry}>
        {isAuthError ? "로그인하러 가기" : "다시 시도"}
      </Button>
    </div>
  );
}

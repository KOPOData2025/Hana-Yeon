import { useState } from "react";
import { useRegisterUpbitKeys } from "@/hooks/api";

interface UpbitKeyManagerProps {
  onKeyRegistered: () => void;
}

export default function UpbitKeyManager({
  onKeyRegistered,
}: UpbitKeyManagerProps) {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showKeys, setShowKeys] = useState(false);

  const registerKeysMutation = useRegisterUpbitKeys();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessKey.trim() || !secretKey.trim()) {
      alert("Access Key와 Secret Key를 모두 입력해주세요.");
      return;
    }

    try {
      await registerKeysMutation.mutateAsync({
        accessKey: accessKey.trim(),
        secretKey: secretKey.trim(),
      });

      alert("Upbit API 키가 성공적으로 등록되었습니다!");
      onKeyRegistered();
    } catch (error: any) {
      console.error("API 키 등록 실패:", error);
      alert(
        error.response?.data?.error || "API 키 등록 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="flex justify-center">
      <div className="rounded-2xl px-8 w-full max-w-md">
        <div className="w-full flex items-center justify-center">
          <img src="upbit_logo.png" className="w-40" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label
              htmlFor="accessKey"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Access Key
            </label>
            <input
              type={showKeys ? "text" : "password"}
              id="accessKey"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg focus:outline-none"
              placeholder="Upbit Access Key를 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="secretKey"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Secret Key
            </label>
            <input
              type={showKeys ? "text" : "password"}
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Upbit Secret Key를 입력하세요"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showKeys"
              checked={showKeys}
              onChange={(e) => setShowKeys(e.target.checked)}
              className="h-4 w-4 text-olo border-gray-300 rounded accent-olo hover:accent-olo focus:accent-olo active:accent-olo"
            />
            <label
              htmlFor="showKeys"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              키 보이기
            </label>
          </div>

          <button
            type="submit"
            disabled={registerKeysMutation.isPending}
            className="w-full bg-olo text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {registerKeysMutation.isPending ? "등록 중..." : "API 키 등록"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">보안 안내</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>API 키는 암호화되어 안전하게 저장됩니다</li>
                <li>조회 권한만 있는 키를 사용하세요</li>
                <li>키는 언제든지 삭제할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://upbit.com/mypage/open_api_management"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-olo hover:text-blue-800 underline"
          >
            Upbit API 키 발급받기 →
          </a>
        </div>
      </div>
    </div>
  );
}

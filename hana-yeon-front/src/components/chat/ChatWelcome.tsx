import { useAuthStore } from "@/store";

export default function ChatWelcome() {
  const { userInfo } = useAuthStore();
  return (
    <div className="px-4 py-6 text-center">
      <div className="text-lg text-gray-700 dark:text-gray-300">
        <span className="text-brand font-bold">{userInfo?.userName}</span>님
        안녕하세요,&nbsp;
        <span className="text-brand font-semibold">하나</span>
        챗봇입니다.
      </div>
      <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        무엇을 도와드릴까요?
      </div>
    </div>
  );
}

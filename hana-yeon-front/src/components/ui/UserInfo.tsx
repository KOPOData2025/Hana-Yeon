import { useAuthStore } from "@/store";

const UserInfo = () => {
  const { userInfo } = useAuthStore();

  const userName = userInfo?.userName ?? "";
  const quizPoint = userInfo?.quizPoint ?? 0;
  const firstChar = userName.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-4 py-4 pl-1 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-olo flex items-center justify-center font-bold text-white text-xl">
          {firstChar}
        </div>

        <div className="flex-1">
          <p className="font-bold text-lg">{userName} 님</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            환영합니다!
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-3 py-2">
        <img src="/hanamoney.png" alt="하나머니" className="w-6 h-6" />
        <span className="font-semibold text-yellow-600 dark:text-yellow-400">
          {quizPoint.toLocaleString()}P
        </span>
      </div>
    </div>
  );
};

export default UserInfo;

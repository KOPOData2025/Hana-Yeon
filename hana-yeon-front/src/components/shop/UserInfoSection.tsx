interface UserInfoSectionProps {
  userName: string;
  cashAmount: number;
}

export default function UserInfoSection({
  userName,
  cashAmount,
}: UserInfoSectionProps) {
  const firstChar = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-olo dark:bg-brand px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-full flex items-center justify-center">
          <img src="/hanadundun_logo.png" className="w-8 h-8" />
        </div>
        <span className="text-gray-100 dark:text-white font-medium">
          {userName}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center justify-end gap-2 px-3 py-2">
          <img src="/hanamoney.png" alt="하나머니" className="w-6 h-6" />
          <span className="font-semibold text-gray-100 dark:text-white">
            {cashAmount.toLocaleString()}P
          </span>
        </div>
      </div>
    </div>
  );
}

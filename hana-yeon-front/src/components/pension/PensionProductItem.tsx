import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib";

interface PensionProductItemProps {
  provider: string;
  productName: string;
  type: string;
  balance: number;
  returnRate: number;
}

export default function PensionProductItem({
  provider,
  productName,
  type,
  balance,
  returnRate,
}: PensionProductItemProps) {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800/50 p-4 rounded-xl mb-2">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
            {provider}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {type}
          </span>
        </div>
        <p className="font-semibold text-gray-900 dark:text-white mt-0.5 truncate w-48">
          {productName}
        </p>
      </div>
      <div className="ml-auto text-right">
        <p className="font-bold text-lg text-gray-900 dark:text-white">
          {formatCurrency(balance, "원")}
        </p>
        <p className="text-sm text-olo flex items-center justify-end gap-1">
          <TrendingUp className="w-4 h-4" />
          수익률 {returnRate}%
        </p>
      </div>
    </div>
  );
}

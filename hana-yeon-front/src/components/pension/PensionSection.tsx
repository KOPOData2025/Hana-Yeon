import { Info } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/Tooltip";

export default function PensionSection({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg flex items-center gap-1.5 text-gray-900 dark:text-white">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>세전 기준이며, 예상 수익률에 따라 변동될 수 있습니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

import { ChevronRight } from "lucide-react";

export default function HomeSection({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {action || (
          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-500" />
        )}
      </div>
      {children}
    </div>
  );
}

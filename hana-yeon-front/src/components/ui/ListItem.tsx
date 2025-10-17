import type React from "react";

interface ListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function ListItem({
  icon,
  title,
  subtitle,
  onClick,
}: ListItemProps) {
  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-olo/50 transition-colors"
      onClick={onClick}
    >
      <div className="w-9 h-9 flex items-center justify-center">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

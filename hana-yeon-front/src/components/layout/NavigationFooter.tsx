import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

// constants
import { navPath, navItems } from "@/constants";
// components

interface NavigationFooterProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function NavigationFooter({
  setSidebarOpen,
}: NavigationFooterProps) {
  return (
    navPath[location.pathname as keyof typeof navPath] && (
      <>
        <div className="mt-20" />
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-sm border-t z-10 bg-white/80 border-gray-200 dark:bg-darkBg/80 dark:border-gray-800">
          <div className="flex justify-around items-center h-[88px]">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                item.subPath?.some((subPath) =>
                  location.pathname.includes(subPath)
                );

              return (
                <Link
                  to={item.href}
                  key={item.name}
                  className={`flex flex-col items-center justify-start flex-1 h-full pt-3 ${
                    isActive ? "text-olo" : "text-gray-500"
                  }`}
                >
                  <item.icon className="w-7 h-7" />
                  <span className={`text-xs ${isActive ? "font-bold" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-start flex-1 h-full pt-3 text-gray-500"
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs">메뉴</span>
            </button>
          </div>
        </footer>
      </>
    )
  );
}

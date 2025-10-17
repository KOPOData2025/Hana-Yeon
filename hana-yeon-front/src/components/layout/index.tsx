import { useState, useEffect, useCallback } from "react";
import { useLocation, Outlet } from "react-router-dom";
// hooks
import { useInternalRouter } from "@/hooks/useInternalRouter";
import { useGetMe } from "@/hooks/api";
// store
import { useAuthStore } from "@/store/authStore";
// constants
import { PATH, publicRoutes } from "@/constants";
// components
import Sidebar from "./Sidebar";
import NavigationFooter from "./NavigationFooter";
import Header from "./MobileHeader";
import PCDialog from "../ui/PCDialog";

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPCDialogOpen, setIsPCDialogOpen] = useState(false);

  const router = useInternalRouter();
  const { setUserInfo } = useAuthStore();
  const { data: userData, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [userData, setUserInfo]);

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      router.push(PATH.SIGN_IN, { replace: true });
      return;
    }

    const isPublicRoute = publicRoutes.includes(location.pathname);
    if (!userData && !isPublicRoute) {
      router.push(PATH.SIGN_IN, { replace: true });
    }
  }, [userData, router, isLoading, isError]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);
  const closeSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      if (prev) return false;
      return prev;
    });
  }, []);

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      setIsPCDialogOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen font-pretendard text-gray-900 dark:bg-darkBg dark:text-darkTextMain max-w-md mx-auto relative flex flex-col bg-background">
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <PCDialog
        isOpen={isPCDialogOpen}
        onClose={() => setIsPCDialogOpen(false)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <NavigationFooter setSidebarOpen={openSidebar} />
    </div>
  );
}

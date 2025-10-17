import { useState } from "react";
import {
  X,
  Settings,
  HelpCircle,
  ChartBarBig,
  Scale,
  Store,
  PiggyBank,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
// hooks
import { useInternalRouter } from "@/hooks";
import { useLogout } from "@/hooks/api";
// constants
import { PATH } from "@/constants";
// components
import SystemSettings from "@/components/settings/SystemSettings";
import UserInfo from "@/components/ui/UserInfo";
import Voc from "@/components/voc/Voc";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useInternalRouter();

  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showVoc, setShowVoc] = useState(false);

  const { mutateAsync: logoutMutation } = useLogout();

  const handleSettingsClick = () => {
    setShowSystemSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSystemSettings(false);
  };

  const handleVocClick = () => {
    setShowVoc(true);
  };

  const handleCloseVoc = () => {
    setShowVoc(false);
  };

  const handleGoMakePensionSaving = () => {
    onClose();
    setTimeout(() => {
      router.push(PATH.MAKE_PENSION_SAVING);
    }, 300);
  };

  const handleGoAiPortfolio = () => {
    onClose();
    setTimeout(() => {
      router.push(PATH.PORTFOLIO);
    }, 300);
  };

  const handleGoComparePension = () => {
    onClose();
    setTimeout(() => {
      router.push(PATH.COMPARE_PENSION);
    }, 300);
  };

  const handleGoShop = () => {
    onClose();
    setTimeout(() => {
      router.push(PATH.SHOP);
    }, 300);
  };

  const handleLogout = async () => {
    onClose();
    await logoutMutation();
    router.replace(PATH.SIGN_IN);
  };

  const SideBarMenuItems = [
    {
      Icon: Store,
      name: "기프티샵",
      onClick: handleGoShop,
    },

    {
      Icon: ChartBarBig,
      name: "AI 자산진단",
      onClick: handleGoAiPortfolio,
    },
    {
      Icon: Scale,
      name: "또래와 연금 비교",
      onClick: handleGoComparePension,
    },
    {
      Icon: PiggyBank,
      name: "연금저축 개설하기",
      onClick: handleGoMakePensionSaving,
    },
    {
      Icon: Settings,
      name: "시스템 설정",
      onClick: handleSettingsClick,
    },
    {
      Icon: HelpCircle,
      name: "문의하기",
      onClick: handleVocClick,
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-sm z-50 p-6 flex flex-col bg-gray-50 dark:bg-darkBg"
            >
              <div className="flex justify-end items-center mb-6">
                <button onClick={onClose} className="p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <UserInfo />
              <nav className="flex-grow">
                <ul>
                  {SideBarMenuItems.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={item.onClick}
                        className="flex items-center gap-4 py-4 text-lg rounded-lg px-2 w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-zinc-900"
                      >
                        <item.Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <button
                className="w-full py-3 rounded-lg font-semibold bg-gray-200 dark:bg-darkCard"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSystemSettings && <SystemSettings onClose={handleCloseSettings} />}
      </AnimatePresence>

      <AnimatePresence>
        {showVoc && <Voc onClose={handleCloseVoc} onSideBarClose={onClose} />}
      </AnimatePresence>
    </>
  );
}

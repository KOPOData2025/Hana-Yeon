import { useState } from "react";
import { Bell, ChevronLeft } from "lucide-react";
// constants
import { PATH, withOutLayout, pageTitles } from "@/constants";
import { useInternalRouter } from "@/hooks/useInternalRouter";
// components
import HomeMission from "@/components/home/HomeMission";

export default function MobileHeader() {
  const router = useInternalRouter();
  const title = pageTitles[location.pathname] ?? "";
  const [isMissionOpen, setIsMissionOpen] = useState(false);

  const goBack = () => {
    if (window.location.href.includes(PATH.COMPARE_PENSION)) {
      router.push(PATH.PENSION);
    } else {
      router.back();
    }
  };

  return (
    <>
      <header className="flex items-center h-16 p-4 sticky top-0 backdrop-blur-sm z-10 flex-shrink-0 bg-background/90 border-b border-gray-200 dark:bg-darkBg/90 dark:border-gray-800">
        {withOutLayout.includes(location.pathname) ? (
          <div
            className="flex items-center gap-2"
            onClick={() => {
              switch (location.pathname) {
                case PATH.SIGN_IN:
                  router.push(PATH.SIGN_IN);
                  break;
                case PATH.SIGN_UP:
                  router.push(PATH.SIGN_IN);
                  break;
                default:
                  router.push(PATH.HOME);
              }
            }}
          >
            <img
              src="hanadundun_logo.png"
              alt="logo"
              className="w-12 h-12 cursor-pointer"
            />
          </div>
        ) : (
          <button onClick={goBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-darkTextMain" />
          </button>
        )}
        <h1 className="text-xl font-bold mx-auto text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="w-10 flex items-center justify-end">
          {location.pathname === PATH.HOME && (
            <button onClick={() => setIsMissionOpen(true)}>
              <Bell className="w-6 h-6 text-gray-900 dark:text-darkTextMain cursor-pointer hover:text-olo dark:hover:text-olo transition-colors" />
            </button>
          )}
        </div>
      </header>

      <HomeMission
        isOpen={isMissionOpen}
        onClose={() => setIsMissionOpen(false)}
      />
    </>
  );
}

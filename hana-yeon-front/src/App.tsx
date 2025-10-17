import { useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { GlobalPortal } from "tosslib";
import Routes from "./router";
import GlobalProvider from "./provider/GlobalProvider";
import Splash from "./components/ui/Splash";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [splashLoaded, setSplashLoaded] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    if (splashLoaded) {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
      }, 1000);

      return () => clearTimeout(splashTimer);
    }
  }, [splashLoaded]);

  if (showSplash) {
    return <Splash setSplashLoaded={setSplashLoaded} />;
  }

  return (
    <GlobalProvider>
      <CookiesProvider>
        <GlobalPortal.Provider>
          <Routes />
        </GlobalPortal.Provider>
      </CookiesProvider>
    </GlobalProvider>
  );
}

export default App;

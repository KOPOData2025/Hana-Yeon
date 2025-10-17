import { useEffect, useState } from "react";

interface SplashProps {
  setSplashLoaded: (loaded: boolean) => void;
}

export default function Splash({ setSplashLoaded }: SplashProps) {
  const [isReady, setIsReady] = useState(false);
  const [src, _] = useState("/hanadundun_logo.png");

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img
      .decode()
      .then(() => setIsReady(true))
      .catch(() => setIsReady(true));
  }, [src]);

  useEffect(() => {
    if (isReady) {
      setSplashLoaded(true);
    }
  }, [isReady, setSplashLoaded]);

  if (!isReady) return null;

  return (
    <div className="fixed max-w-md mx-auto inset-0 bg-white dark:bg-darkBg flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <img src={src} alt="Hanadundun Logo" className="w-52 h-52 mb-4" />
        <div className="text-3xl font-bold mb-2">
          <span className="text-olo">하나</span>
          <span className="text-yeon">:연(緣)</span>
        </div>
        <div className="text-gray-700 dark:text-gray-100 text-sm">
          나의 금융 파트너
        </div>
      </div>
    </div>
  );
}

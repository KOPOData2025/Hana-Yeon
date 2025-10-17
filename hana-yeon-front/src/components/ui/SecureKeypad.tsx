import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface SecureKeypadProps {
  onPasswordChange: (password: string) => void;
  passwordLength?: number;
  onComplete?: () => void;
  resetPassword?: boolean;
}

export default function SecureKeypad({
  onPasswordChange,
  passwordLength = 6,
  onComplete,
  resetPassword,
}: SecureKeypadProps) {
  const [password, setPassword] = useState("");
  const [shuffledKeys, setShuffledKeys] = useState<number[]>([]);

  useEffect(() => {
    const keys = Array.from({ length: 10 }, (_, i) => i);
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    setShuffledKeys(keys);
  }, []);

  useEffect(() => {
    onPasswordChange(password);
    if (password.length === passwordLength) {
      onComplete?.();
    }
  }, [password, onPasswordChange, passwordLength, onComplete]);

  useEffect(() => {
    setPassword("");
  }, [resetPassword]);

  const handleKeyPress = (key: number) => {
    if (password.length < passwordLength) {
      setPassword(password + key);
    }
  };

  const handleBackspace = () => {
    setPassword(password.slice(0, -1));
  };

  const renderKeypad = () => {
    const keyButtons = shuffledKeys.map((key) => (
      <Button
        variant="outline"
        key={key}
        onClick={() => handleKeyPress(key)}
        className="text-3xl h-20 rounded-none font-medium border-none bg-transparent text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-white active:bg-gray-300/50 dark:active:bg-gray-700/50 active:text-gray-700 dark:active:text-white focus:bg-gray-200/50 dark:focus:bg-gray-800/50 focus:text-gray-700 dark:focus:text-white"
      >
        {key}
      </Button>
    ));

    return (
      <div className="w-full grid grid-cols-3">
        {keyButtons.slice(0, 9)}
        <div />
        {keyButtons[9]}
        <Button
          variant="outline"
          onClick={handleBackspace}
          className="h-16 rounded-none border-none bg-transparent text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-white active:bg-gray-300/50 dark:active:bg-gray-700/50 active:text-gray-700 dark:active:text-white focus:bg-gray-200/50 dark:focus:bg-gray-800/50 focus:text-gray-700 dark:focus:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mx-auto text-gray-700 dark:text-white"
          >
            <path
              className="text-gray-700 dark:text-white"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
            />
          </svg>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center items-center space-x-3 my-2">
        {Array.from({ length: passwordLength }).map((_, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full border border-gray-400 dark:border-gray-600 ${
              index < password.length
                ? "bg-gray-700 dark:bg-gray-100"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      <div className="mt-24" />
      {renderKeypad()}
    </div>
  );
}

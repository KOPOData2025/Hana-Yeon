import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface KeypadProps {
  onValueChange: (value: string) => void;
  maxLength?: number;
  onComplete?: () => void;
  resetValue?: boolean;
}

export default function Keypad({
  onValueChange,
  maxLength,
  onComplete,
  resetValue,
}: KeypadProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    onValueChange(value);
    if (maxLength && value.length === maxLength) {
      onComplete?.();
    }
  }, [value, onValueChange, maxLength, onComplete]);

  useEffect(() => {
    if (resetValue) {
      setValue("");
    }
  }, [resetValue]);

  const handleKeyPress = (key: number) => {
    if (!maxLength || value.length < maxLength) {
      setValue(value + key);
    }
  };

  const handleBackspace = () => {
    setValue(value.slice(0, -1));
  };

  const renderKeypad = () => {
    const keys = Array.from({ length: 10 }, (_, i) => i);
    const keyButtons = keys.map((key) => (
      <Button
        variant="outline"
        key={key}
        onClick={() => handleKeyPress(key)}
        className="text-2xl h-16 rounded-none border-none bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400 focus:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:focus:bg-gray-600"
      >
        {key}
      </Button>
    ));

    return (
      <div className="w-full grid grid-cols-3">
        {keyButtons.slice(1, 10)}
        <div />
        {keyButtons[0]}
        <Button
          variant="outline"
          onClick={handleBackspace}
          className="h-16 rounded-none border-none bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400 focus:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:focus:bg-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mx-auto"
          >
            <path
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 z-50">
      {renderKeypad()}
    </div>
  );
}

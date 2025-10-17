import { useState, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white dark:bg-gray-800 px-4 pt-2 pb-6 border-olo">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={
              disabled ? "연결 중입니다..." : "궁금한 사항을 입력해 주세요"
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-brand disabled:bg-gray-200"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
          />
        </div>
        <button
          className="p-2 text-white bg-brand rounded-full disabled:bg-gray-400"
          onClick={handleSend}
          disabled={disabled || !input.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

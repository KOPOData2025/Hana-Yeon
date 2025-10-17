import { useState, useEffect } from "react";
import ChatBounceDot from "../ui/ChatBounceDot";
import type { TChatMessage } from "@/types";

interface ChatMessageProps {
  message: TChatMessage;
  isUser?: boolean;
  timestamp?: number;
  onOptionClick?: (nextId: string) => void;
  isLoading?: boolean;
  isTyping?: boolean;
  typingSpeed?: number;
  scrollToBottom?: () => void;
}

export default function ChatMessage({
  message,
  isUser = false,
  timestamp,
  onOptionClick,
  isLoading,
  isTyping = false,
  typingSpeed = 50,
  scrollToBottom,
}: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (isTyping && !isUser && message.answer) {
      let currentIndex = 0;
      const text = message.answer;
      setDisplayedText("");

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          scrollToBottom?.();
        } else {
          clearInterval(typeInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    } else if (!isTyping && !isUser && message.answer) {
      setDisplayedText(message.answer);
      scrollToBottom?.();
    }
  }, [isTyping, isUser, message.answer, typingSpeed]);

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2 mb-4">
        {timestamp && (
          <div className="text-xs text-gray-500 mb-1">
            {new Date(timestamp).toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
        )}
        <div className="bg-olo/90 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-xs">
          {message.question}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 mb-6 ${
        isLoading ? "w-1/3" : "w-11/12"
      }`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-gray-200">
        <img
          src="/byulbut.png"
          alt="하나은행 캐릭터"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <ChatBounceDot />
        ) : (
          <div className="flex gap-3">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 mb-3">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
                {displayedText}
              </p>
            </div>
            {timestamp && (
              <div className="text-xs text-gray-500 self-end mb-3">
                {new Date(timestamp).toLocaleTimeString("ko-KR", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            )}
          </div>
        )}
        {message.options && message.options.length > 0 && !isTyping && (
          <div className="w-fit flex flex-col flex-wrap gap-2">
            {message.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionClick?.(option.nextId!)}
                className="bg-sky-100 text-gray-700 px-3 py-2 rounded-full text-sm transition-colors border border-gray-300"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

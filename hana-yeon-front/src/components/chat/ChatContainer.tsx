import { useState, useEffect, useRef, useCallback } from "react";
// constants
import { PENSION_CHAT_DATA, WELCOME_CHAT_MESSAGE } from "@/constants";
// hooks
import { useWebSocket } from "@/hooks/useWebSocket";
// types
import type { TChatMessage } from "@/types";
// lib
import { delay } from "@/lib/util";
// components
import ChatWelcome from "./ChatWelcome";
import ChatKeywordChips from "./ChatKeywordChips";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const TYPING_SPEED = 50 as const;

interface DisplayMessage extends TChatMessage {
  isUser?: boolean;
  timestamp: number;
  isTyping?: boolean;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    WELCOME_CHAT_MESSAGE,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageReceived = useCallback((receivedMessage: TChatMessage) => {
    const botMessage: DisplayMessage = {
      ...receivedMessage,
      id: `ai-${Date.now()}`,
      question: "",
      answer: receivedMessage?.message ?? "오류가 발생했어요.",
      isUser: false,
      timestamp: Date.now(),
      isTyping: true,
    };

    setIsLoading(false);
    setMessages((prev) => [...prev, botMessage]);
    const typingDuration = (botMessage.answer.length || 0) * TYPING_SPEED + 500;

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.timestamp === botMessage.timestamp
            ? { ...msg, isTyping: false }
            : msg
        )
      );
      scrollToBottom();
    }, typingDuration);
  }, []);

  const { sendMessage, isConnected } = useWebSocket(handleMessageReceived);

  useEffect(() => {
    if (messages.length <= 1) return;
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: DisplayMessage = {
      id: `user-${Date.now()}`,
      question: userInput,
      answer: userInput,
      isUser: true,
      timestamp: Date.now(),
      contents: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    sendMessage(userInput);
  };

  const handleKeywordClick = async (chatMessage: TChatMessage) => {
    const userMessage: DisplayMessage = {
      ...chatMessage,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    await delay(2000);

    const botMessage: DisplayMessage = {
      ...chatMessage,
      isUser: false,
      timestamp: Date.now() + 1,
      isTyping: true,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && !msg.isUser
            ? { ...msg, isTyping: false }
            : msg
        )
      );
    }, chatMessage.answer.length * TYPING_SPEED + 500);
  };

  const handleOptionClick = (nextId: string) => {
    const nextMessage = PENSION_CHAT_DATA.find((msg) => msg.id === nextId);
    if (nextMessage) {
      handleKeywordClick(nextMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-darkCard">
      <div className="flex-1 overflow-y-auto">
        <ChatWelcome />
        <ChatKeywordChips onChipClick={handleKeywordClick} />

        <div className="px-4 pb-4">
          {messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`}>
              <ChatMessage
                message={message}
                isUser={message.isUser}
                timestamp={message.timestamp}
                onOptionClick={handleOptionClick}
                isLoading={false}
                isTyping={message.isTyping}
                typingSpeed={TYPING_SPEED}
                scrollToBottom={scrollToBottom}
              />
            </div>
          ))}
          {isLoading && (
            <ChatMessage
              message={{
                id: "loading",
                question: "",
                answer: "",
                contents: [],
              }}
              isUser={false}
              timestamp={Date.now()}
              isLoading={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
    </div>
  );
}

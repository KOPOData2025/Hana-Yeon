import { INITIAL_CHAT_CHIPS } from "../../constants/chat";
import type { TChatMessage } from "@/types";

interface ChatKeywordChipsProps {
  onChipClick: (message: TChatMessage) => void;
}

export default function ChatKeywordChips({
  onChipClick,
}: ChatKeywordChipsProps) {
  return (
    <div className="mb-4 px-4 bg-transparent">
      <div className="flex flex-wrap gap-2">
        {INITIAL_CHAT_CHIPS.map((message) => (
          <button
            key={message.id}
            onClick={() => onChipClick(message)}
            className="bg-olo/10 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full text-sm transition-colors border border-gray-300"
          >
            {message.question}
          </button>
        ))}
      </div>
    </div>
  );
}

import { themeStore } from "@/store/themeStore";
import type { CSSProperties } from "react";
import { Checkbox, Text } from "tosslib";

interface BinaryOptionProps {
  isSelected: boolean;
  optionText: string;
  handleSelect: () => void;
}

export function BinaryOption({
  isSelected,
  optionText,
  handleSelect,
}: BinaryOptionProps) {
  const { theme } = themeStore();
  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={handleSelect}
      style={
        {
          "& path": {
            fill: "hsl(var(--primary))",
          },
        } as CSSProperties
      }
    >
      <Checkbox.Line
        inputType="radio"
        name="binary-question"
        checked={isSelected}
        readOnly
      />
      <Text fontSize={14} color={theme === "dark" ? "white" : "black"}>
        {optionText}
      </Text>
    </div>
  );
}

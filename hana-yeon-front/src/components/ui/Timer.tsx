import React from "react";
import { cn, formatTime } from "@/lib";

interface TimerProps {
  min: number;
  sec: number;
  absolute?: boolean;
}

const Timer = ({ min, sec, absolute = true }: TimerProps) => {
  return (
    <span
      className={cn("text-red-500 text-sm", absolute && "absolute right-3")}
    >
      {formatTime(min * 60 + sec)}
    </span>
  );
};

export default React.memo(Timer);

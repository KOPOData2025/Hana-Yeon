import { useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { enqueueSnackbar } from "notistack";
// hooks
import { usePostVoc } from "@/hooks/api";

interface VocProps {
  onClose: () => void;
  onSideBarClose?: () => void;
}

export default function Voc({ onClose, onSideBarClose }: VocProps) {
  const [content, setContent] = useState("");
  const { mutateAsync } = usePostVoc();

  const handlePostVoc = async () => {
    const res = await mutateAsync({ content });

    if (res?.success) {
      enqueueSnackbar("소중한 의견이 접수되었어요!", { variant: "success" });
    } else {
      enqueueSnackbar("오류가 발생했어요", { variant: "error" });
    }
    onClose();
    onSideBarClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-darkBg w-full max-w-sm rounded-2xl p-6 flex flex-col gap-6"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">고객의 소리</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            불편한 사항이나 서비스의 아쉬운 점을 말씀해주세요.
            <br />
            소중한 의견을 반영하여 더 나은 서비스를 제공하겠습니다.
          </p>
          <textarea
            className="w-full h-48 p-4 rounded-lg bg-gray-50 border border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700 outline-none"
            placeholder="여기에 내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          className="w-full py-3 rounded-lg font-semibold bg-olo text-gray-50"
          onClick={handlePostVoc}
        >
          의견 보내기
        </button>
      </motion.div>
    </motion.div>
  );
}

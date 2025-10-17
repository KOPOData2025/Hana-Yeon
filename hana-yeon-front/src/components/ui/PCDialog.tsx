import { InfoIcon } from "lucide-react";
import DialogCommon from "./DialogCommon";

interface PCDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PCDialog = ({ isOpen, onClose }: PCDialogProps) => {
  return (
    <DialogCommon
      open={isOpen}
      title="PC접속 알림"
      type="alert"
      btn1Text="확인"
      btn1Handler={onClose}
    >
      <div className="flex text-base">
        <InfoIcon className="w-6 h-6 text-olo mr-2 mt-1" />
        모바일 환경에서 앱 다운 후
        <br />
        이용을 권장해요.
      </div>
    </DialogCommon>
  );
};

export default PCDialog;

import { Modal, Text, Spacing, Flex, Button } from "tosslib";

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
}

export function SaveModal({ open, onClose, onSave }: SaveModalProps) {
  const handleSave = async () => {
    await onSave();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content>
        <Text fontSize={20} fontWeight="bold" color="hsl(var(--card))">
          저장하고 나가시겠어요?
        </Text>
        <Spacing size={24} />
        <Flex direction="row" gap={12} justifyContent="flex-end">
          <Button size="medium" theme="dark" style="weak" onClick={onClose}>
            닫기
          </Button>
          <Button size="medium" theme="primary" onClick={handleSave}>
            저장하고 나가기
          </Button>
        </Flex>
      </Modal.Content>
    </Modal>
  );
}

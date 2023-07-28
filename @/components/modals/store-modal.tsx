"use client";

import { useStoreModal } from "hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
  const { isOpen, onOpen, onClose, title, description } = useStoreModal();
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      Future Store Form
    </Modal>
  );
};

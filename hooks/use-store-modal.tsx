import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  description: string;
  change: (title: string, description: string) => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  title: "",
  description: "",
  change: (title: string, description: string) => set({ title, description }),
  //set children
}));

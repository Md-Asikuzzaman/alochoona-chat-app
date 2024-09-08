import { create } from "zustand";

type TypingStore = {
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
};

export const useTyping = create<TypingStore>()((set) => ({
  isTyping: false,
  setIsTyping: (typing) =>
    set(() => ({
      isTyping: typing,
    })),
}));

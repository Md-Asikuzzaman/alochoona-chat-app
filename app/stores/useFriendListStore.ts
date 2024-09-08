import { create } from "zustand";

type FriendListStore = {
  friendListActive: boolean;
  setFriendListActive: () => void;
};

export const useFriendListActive = create<FriendListStore>()((set) => ({
  friendListActive: true,
  setFriendListActive: () =>
    set((state) => ({
      friendListActive: !state.friendListActive,
    })),
}));

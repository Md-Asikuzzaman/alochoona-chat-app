import React from "react";
import { CgMenuRight } from "react-icons/cg";

import { useFriendListActive } from "@/lib/store";

const FriendListMenu = () => {
  const { setFriendListActive } = useFriendListActive();
  return (
    <div
      onClick={() => setFriendListActive()}
      className="absolute left-0 top-0 flex h-10 w-10 translate-x-4 translate-y-4 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-zinc-200 lg:hidden"
    >
      <CgMenuRight size={20} />
    </div>
  );
};

export default FriendListMenu;

"use client";

import clsx from "clsx";
import { NextPage } from "next";
import Link from "next/link";
import Avatar from "react-avatar";

interface Props {
  user: UserType;
  receiverId: string;
  isOnline: boolean;
  setFriendListActive: () => void;
}

const Friend: NextPage<Props> = ({
  user: { id, username },
  receiverId,
  setFriendListActive,
  isOnline,
}) => {
  return (
    <Link onClick={() => setFriendListActive()} href={`/chat/${id}`}>
      <div
        className={clsx(
          "group flex items-center justify-between gap-4  rounded-xl p-4 hover:bg-[#703EFF]",
          receiverId === id ? "bg-[#703EFF]" : "bg-[#fff]",
        )}
      >
        <div className="relative">
          <Avatar name={username} size="35" round={true} />

          <span
            className={clsx(
              "absolute bottom-0 right-0 inline-block h-[12px] w-[12px] rounded-full border-2 border-white shadow-lg",

              isOnline ? "bg-[#00DC96]" : "bg-zinc-400",
            )}
          ></span>
        </div>

        <div className="flex-1 truncate">
          <div className="flex items-center justify-between">
            <h4
              className={clsx(
                " font-semibold group-hover:text-[#fff]",
                receiverId === id ? "text-[#fff]" : "text-[#162C4D]",
              )}
            >
              {username}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <p
              className={clsx(
                "text-xs group-hover:text-[rgba(255,255,255,0.80)]",
                receiverId === id
                  ? "text-[rgba(255,255,255,0.80)]"
                  : "text-[rgba(22,44,77,0.80)]",
              )}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friend;

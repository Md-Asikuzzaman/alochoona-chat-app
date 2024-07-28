import { useFriendListActive } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "react-avatar";
import { MdMarkChatUnread } from "react-icons/md";

interface Props {
  user: UserType;
  receiverId: string;
}

const Friend: NextPage<Props> = ({
  user: { id, username, status },
  receiverId,
}) => {
  return (
    <Link onClick={() => {}} href={`/chat/${id}`}>
      <div
        className={clsx(
          "flex items-center justify-between gap-4 rounded-xl  p-4 hover:bg-[#E1D1F0]",
          receiverId === id ? "bg-[#E1D1F0]" : "bg-zinc-100",
        )}
      >
        <div className="relative">
          <Avatar name={username} size="35" round={true} />

          <span
            className={clsx(
              "absolute bottom-0 right-0 inline-block h-[12px] w-[12px] rounded-full border-2 border-white shadow-lg",
              status === "online" ? "bg-green-500" : "bg-zinc-400",
            )}
          ></span>
        </div>

        <div className="flex-1 truncate">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold text-[#8318b4]`}>{username}</h4>
            <span className={`text-xs text-[#8318b4]/70`}>3:00 PM</span>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm">New messages!</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friend;

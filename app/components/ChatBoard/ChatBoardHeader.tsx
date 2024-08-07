"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import axios from "axios";
import clsx from "clsx";
import Avatar from "react-avatar";

import { useQuery } from "@tanstack/react-query";
import { CgMenuRight } from "react-icons/cg";
import { useFriendListActive } from "@/lib/store";

import { useSocket } from "../providers/SocketProvider";
import LogOutButton from "../ui/LogOutButton";

const ChatBoardHeader = () => {
  const { id: friendId } = useParams<{ id: string }>();

  // socket useEffects
  const { socket } = useSocket();

  const [friendOnline, setFriendOnline] = useState<boolean>(false);

  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery<UserType>({
    queryKey: ["fetch_user"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${friendId}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return data.user;
    },
    enabled: friendId ? true : false,
  });

  const { setFriendListActive } = useFriendListActive();

  useEffect(() => {
    if (socket) {
      socket.on("updateUsers", (data) => {
        const isFriendOnline = data.some((d: any) => d.userId === friendId);
        setFriendOnline(isFriendOnline);
      });
    }
  }, [socket, friendId]);

  return (
    <div className="relative flex items-center gap-5 bg-white px-4 py-4">
      <div
        onClick={() => setFriendListActive()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-zinc-200 lg:hidden"
      >
        <CgMenuRight size={20} />
      </div>
      {user?.username && (
        <div className="relative">
          <Avatar name={user.username} size="35" round={true} />
          <span
            className={clsx(
              "absolute -bottom-[2px] -right-[2px] inline-block h-[14px] w-[14px] rounded-full border-2 border-white shadow-lg ",
              friendOnline ? "bg-green-500" : "bg-zinc-400",
            )}
          ></span>
        </div>
      )}
      <div className="flex flex-1 justify-between">
        <div>
          <h4 className="font-semibold">
            {isLoading || isFetching ? "Loading..." : user?.username}
          </h4>
          <p className="text-xs text-zinc-500">
            {friendOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <LogOutButton />
    </div>
  );
};

export default ChatBoardHeader;

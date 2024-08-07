"use client";

import { NextPage } from "next";
import { useEffect } from "react";

import { LuMessagesSquare } from "react-icons/lu";
import { useSocket } from "../components/providers/SocketProvider";

import FriendListMenu from "../components/ui/FriendListMenu";
import LogOutButton from "../components/ui/LogOutButton";

interface Props {
  userId: string | undefined;
}

const HomeClient: NextPage<Props> = ({ userId }) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", userId);

      socket.on("updateUsers", (data) => {
        console.log(data);
      });
    }
  }, [socket]);
  return (
    <section className="relative grid h-[calc(100vh-85px)] place-content-center">
      <div className="flex flex-col items-center justify-center">
        <LuMessagesSquare size={110} className="text-zinc-500" />
        <h1 className="text-2xl text-zinc-500">Let's start conversions...</h1>
      </div>

      {/* Friend list menu  */}
      <FriendListMenu />

      {/* logout button */}
      <LogOutButton />
    </section>
  );
};

export default HomeClient;

"use client";

import { LuMessagesSquare } from "react-icons/lu";
import LogOutButton from "../components/ui/LogOutButton";
import FriendListMenu from "../components/ui/FriendListMenu";
import { useEffect } from "react";
import { useSocket } from "../components/providers/SocketProvider";

import { NextPage } from "next";

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

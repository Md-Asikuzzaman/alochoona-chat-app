"use client";

import { useRef } from "react";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import ChatBoardHeader from "@/app/components/ChatBoard/ChatBoardHeader";

import LogOutButton from "@/app/components/ui/LogOutButton";
import { NextPage } from "next";
import ChatBoradForm from "@/app/components/ChatBoard/ChatBoradForm/ChatBoradForm";
import ChatBoardPlayGround from "@/app/components/ChatBoard/ChatBoardPlayGround/ChatBoardPlayGround";

interface Props {
  currentUser: string | any;
}

const ChatClient: NextPage<Props> = ({ currentUser }) => {
  // Get sender id
  const { data } = useSession();
  const user = data?.user as UserType;
  const senderId = user?.id;

  // Get receiver id
  const { id } = useParams();
  const receiverId = id as string;

  // Working with div ref for auto scrolling
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scrolling funciton
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* chat board header */}
      <ChatBoardHeader />

      {/* chat board */}
      <ChatBoardPlayGround
        currentUser={currentUser}
        scrollRef={scrollRef}
        scrollToBottom={scrollToBottom}
      />

      {/* chat board form */}
      <ChatBoradForm
        currentUser={currentUser}
        scrollToBottom={scrollToBottom}
      />
    </>
  );
};

export default ChatClient;

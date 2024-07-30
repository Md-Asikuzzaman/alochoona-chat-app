"use client";

import { useEffect, useRef, useState } from "react";
import ChatBoardHeader from "@/app/components/ChatBoard/ChatBoardHeader";
import { NextPage } from "next";
import ChatBoradForm from "@/app/components/ChatBoard/ChatBoradForm/ChatBoradForm";
import ChatBoardPlayGround from "@/app/components/ChatBoard/ChatBoardPlayGround/ChatBoardPlayGround";
import { io } from "socket.io-client";

interface Props {
  currentUser: string | any;
}

const ChatClient: NextPage<Props> = ({ currentUser }) => {
  // Working with div ref for auto scrolling
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scrolling funciton
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight + 200,
        behavior: "smooth",
      });
    }
  };

  // socket connection
  return (
    <>
      {/* chat board header */}
      <ChatBoardHeader />

      {/* chat board */}
      <ChatBoardPlayGround currentUser={currentUser} scrollRef={scrollRef} />

      {/* chat board form */}
      <ChatBoradForm
        currentUser={currentUser}
        scrollToBottom={scrollToBottom}
      />
    </>
  );
};

export default ChatClient;

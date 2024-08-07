"use client";

import { useRef } from "react";
import ChatBoardHeader from "@/app/components/ChatBoard/ChatBoardHeader";
import { NextPage } from "next";
import ChatBoradForm from "@/app/components/ChatBoard/ChatBoradForm/ChatBoradForm";
import ChatBoardPlayGround from "@/app/components/ChatBoard/ChatBoardPlayGround/ChatBoardPlayGround";

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

  const scrollToTyping = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;

      if (Math.abs(scrollTop) <= 350) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight + 200,
          behavior: "smooth",
        });
      }
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
        scrollToTyping={scrollToTyping}
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

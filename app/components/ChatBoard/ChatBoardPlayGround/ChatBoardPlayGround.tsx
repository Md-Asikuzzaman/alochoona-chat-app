"use client";

import { NextPage } from "next";
import { ForwardedRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { LuLoader2 } from "react-icons/lu";

import Chat from "./Chat";
import ChatSkeleton from "./ChatSkeleton";
import TypingIndicator from "../../ui/TypingIndicator";
import { useTyping } from "@/lib/store";
import moment from "moment";

interface Props {
  currentUser: string;
  scrollRef: any;
}

// Group messages by date
const groupMessagesByDate = (messages: MessageType[]) => {
  return messages.reduce((acc: Record<string, MessageType[]>, message) => {
    const date = new Date(message.createdAt).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].unshift(message);
    return acc;
  }, {});
};

const ChatBoardPlayGround: NextPage<Props> = ({ currentUser, scrollRef }) => {
  const [userSwitch, setUserSwitch] = useState(false);

  const { id } = useParams();
  const friendId = id;

  useEffect(() => {
    setUserSwitch(true);
  }, [friendId]);

  // [ FETCH ] data based on receiverID and senderID
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<MessageType[]>({
    queryKey: ["fetch_messages"],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(
        `/api/conversations/?senderId=${currentUser}&receiverId=${friendId}`,
        {
          params: {
            _initialPage: pageParam,
            _limitPerPage: 10,
          },
        },
      );

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.messages.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: currentUser && friendId ? true : false,
  });

  // scroll inView
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [!isPending && !isFetching && inView]);

  // loading indicator
  if (!isFetchingNextPage) {
    if (isPending || isFetching) {
      if (userSwitch) {
        return <ChatSkeleton />;
      }
    }
  }

  // Message Format
  const allMessages = messages?.pages.flatMap((page: any) => page.messages);

  // Group messages by date
  const groupedMessages = allMessages && groupMessagesByDate(allMessages);

  return (
    <div
      ref={scrollRef}
      className="flex h-[calc(100dvh-160px)] flex-col-reverse overflow-x-hidden overflow-y-scroll px-5 pt-2"
    >
      {/* Chats Logic */}
      <AnimatePresence mode="popLayout">
        {groupedMessages &&
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <div className="my-2 flex items-center justify-center">
                <p className="shrink-0 rounded-full bg-gray-200 px-3 py-1 text-center text-[12px] text-gray-500">
                  {moment(date).format("ll")}
                </p>
              </div>
              {groupedMessages[date].map((message: MessageType) => (
                <Chat
                  key={message.id}
                  data={message}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ))}
      </AnimatePresence>

      {hasNextPage && (
        <div
          ref={ref}
          onClick={() => fetchNextPage()}
          className="flex justify-center"
        >
          <LuLoader2 className="animate-spin text-violet-500" size={22} />
        </div>
      )}
    </div>
  );
};

export default ChatBoardPlayGround;

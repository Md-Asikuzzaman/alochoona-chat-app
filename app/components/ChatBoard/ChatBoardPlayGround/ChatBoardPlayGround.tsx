"use client";

import { NextPage } from "next";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { LuLoader2 } from "react-icons/lu";

import Chat from "./Chat";
import ChatSkeleton from "./ChatSkeleton";
import moment from "moment";
import TypingIndicator from "../../ui/TypingIndicator";
import { groupMessagesByDate } from "@/app/utils/groupMessagesByDate";
import { useTyping } from "@/app/stores/useTypeStore";


interface Props {
  currentUser: string;
  scrollRef: any;
  scrollToTyping: () => void;
}

const ChatBoardPlayGround: NextPage<Props> = ({
  currentUser,
  scrollRef,
  scrollToTyping,
}) => {
  const { id: friendId } = useParams<{ id: string }>();
  const { isTyping } = useTyping();

  useEffect(() => {
    if (isTyping) {
      scrollToTyping();
    }
  }, [isTyping]);

  // [ FETCH ] messages based on receiverID and senderID
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
      return <ChatSkeleton />;
    }
  }

  // messages format
  const allMessages = messages?.pages.flatMap((page: any) => page.messages);

  // group messages by date
  const groupedMessages = allMessages && groupMessagesByDate(allMessages);

  return (
    <div
      ref={scrollRef}
      className="flex h-[calc(100dvh-160px)] flex-col-reverse overflow-x-hidden overflow-y-scroll px-5 pt-2"
    >
      {/* chats Logic */}
      <AnimatePresence mode="popLayout">
        {/* typing indicator */}
        {isTyping && (
          <div className="mt-1 flex justify-start">
            <TypingIndicator />
          </div>
        )}
        {groupedMessages &&
          Object.keys(groupedMessages).map((date, i) => (
            <div key={i}>
              <div className="my-2 flex items-center justify-center">
                <p className="shrink-0 rounded-full bg-[#ebe8ff] px-3 py-1 text-center text-[12px] text-[rgba(113,62,255,0.80)]">
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

      {/* next page loading indicator */}

      {hasNextPage && (
        <div
          ref={ref}
          onClick={() => fetchNextPage()}
          className="flex justify-center"
        >
          <LuLoader2 className="animate-spin text-[#703eff]" size={22} />
        </div>
      )}
    </div>
  );
};

export default ChatBoardPlayGround;

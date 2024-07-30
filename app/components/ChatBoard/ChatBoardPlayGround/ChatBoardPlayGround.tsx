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

interface Props {
  currentUser: string;
  scrollRef: any;
  scrollToBottom: () => void;
}

const ChatBoardPlayGround: NextPage<Props> = ({
  currentUser,
  scrollRef,
  scrollToBottom,
}) => {
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

  console.log(messages);

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

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col-reverse gap-2 overflow-x-hidden overflow-y-scroll px-5 py-2">
      <AnimatePresence mode="popLayout">
        {messages?.pages.map((page: any) =>
          page.messages
            .flat()
            .map((data: MessageType) => (
              <Chat key={data.id} data={data} currentUser={currentUser} />
            )),
        )}
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

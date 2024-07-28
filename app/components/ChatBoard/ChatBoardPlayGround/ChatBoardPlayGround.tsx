"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import { LegacyRef, useEffect, useRef, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MdDelete } from "react-icons/md";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";
import ChatSkeleton from "../../ui/ChatSkeleton";
import { LuLoader2 } from "react-icons/lu";
import { getSession, useSession } from "next-auth/react";
import Chat from "./Chat";

interface Props {
  currentUser: string;
  scrollRef: LegacyRef<HTMLDivElement> | null;
  scrollToBottom: () => void;
}

const ChatBoardPlayGround: NextPage<Props> = ({
  currentUser,
  scrollRef,
  scrollToBottom,
}) => {
  const queryClient = useQueryClient();

  const { id } = useParams();
  const friendId = id;

  const [userSwitch, setUserSwitch] = useState(false);

  useEffect(() => {
    setUserSwitch(true);
  }, [friendId]);

  // [FETCH] data based on receiverID and senderID
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

    // refetchInterval: 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.messages.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: currentUser && friendId ? true : false,
  });

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (!isFetchingNextPage) {
    if (isPending || isFetching) {
      if (userSwitch) {
        return <ChatSkeleton />;
      }
    }
  }

  return (
    <div className="bg-red flex h-[calc(100vh-160px)] flex-col gap-2 overflow-x-hidden overflow-y-scroll px-5 py-2">
      <AnimatePresence mode="popLayout">
        {messages?.pages.map((page: any) =>
          page.messages
            .flat()
            .map((data: MessageType) => (
              <Chat data={data} currentUser={currentUser} />
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

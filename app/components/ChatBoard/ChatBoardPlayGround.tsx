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

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MdDelete } from "react-icons/md";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";
import ChatSkeleton from "../ui/ChatSkeleton";
import { LuLoader2 } from "react-icons/lu";
import { getSession, useSession } from "next-auth/react";

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
          page.messages.flat().map((data: MessageType) => (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
                y: 200,
                visibility: "hidden",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                visibility: "visible",
              }}
              transition={{
                ease: "backInOut",
              }}
              key={data.id}
              className={clsx(
                "flex shrink-0 ",
                currentUser === data.senderId ? "justify-end" : "justify-start",
              )}
            >
              {/* main chat */}
              <div className="group/item flex max-w-[90%] items-center gap-1">
                <div
                  onClick={() => {}}
                  className={clsx(
                    "grid h-6 w-6 shrink-0 translate-x-10 cursor-pointer place-content-center rounded-full bg-zinc-300  transition-transform group-hover/item:translate-x-0",
                    currentUser === data.senderId ? "grid" : "hidden",
                  )}
                >
                  <MdDelete className="text-zinc-500" />
                </div>

                {/* SETUP for [text] type data */}
                {data.type === "text" && (
                  <div
                    className={clsx(
                      "z-20 inline-block px-4 py-3",
                      currentUser === data.senderId
                        ? "rounded-b-2xl rounded-s-2xl bg-[#6918b4] text-white"
                        : "rounded-b-2xl rounded-e-2xl bg-[#E1D1F0] text-[#8318b4]",
                    )}
                  >
                    <p>{data.message}</p>
                  </div>
                )}

                {/* SETUP for [file] type data */}
                {data.type === "file" && (
                  <div
                    className={clsx(
                      "z-20 inline-block overflow-hidden",
                      currentUser === data.senderId
                        ? "rounded-b-xl rounded-s-xl"
                        : "rounded-b-xl rounded-e-xl",
                    )}
                  >
                    <img src={data.message} height={200} width={200} />
                  </div>
                )}
              </div>
            </motion.div>
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

"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import Friend from "./Friend";
import FriendSkeleton from "./FriendSkeleton";
import clsx from "clsx";

import { IoClose } from "react-icons/io5";
import { useFriendListActive } from "@/lib/store";
import { LuLoader2 } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSocket } from "../providers/SocketProvider";

interface Props {
  userId: string | undefined;
  userName: string | undefined;
}

const FriendsList: NextPage<Props> = ({ userId, userName }) => {
  const [activeUsers, setActiveUser] = useState<any>();
  const { socket } = useSocket();

  const params = useParams();
  const { id } = params;
  const receiverId = id as string;

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", userId);

      socket.on("updateUsers", (data) => {
        setActiveUser(data);
      });
    }
  }, [socket]);

  const {
    data: users,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
  } = useInfiniteQuery<UserType[]>({
    queryKey: ["fetch_users"],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get("/api/users", {
        params: {
          _initialPage: pageParam,
          _limitPerPage: 10,
        },
      });

      return data;
    },
    refetchInterval: 5000,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.users.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // filter all users without loggedin user
  const { friendListActive, setFriendListActive } = useFriendListActive();

  const filteredUsers = users?.pages.map(
    (page: any) =>
      page && page.users.filter((fu: UserType) => fu.id !== userId),
  );

  return (
    <div
      className={clsx(
        "hiddedn 0 absolute left-0 top-0 z-[9999999] w-[88%] bg-[#EDE9FC] shadow-lg transition-transform sm:w-[85%] md:w-[70%] lg:relative lg:w-[390px] lg:shadow-none",
        friendListActive
          ? "-translate-x-[110%] lg:translate-x-0"
          : "translate-x-0",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="mb-1 flex items-center gap-3 px-4 py-3 text-xl font-semibold text-black">
          <Avatar name={userName} size="35" round={true} />
          {userName}
        </h3>

        {/* close button*/}
        <div
          onClick={() => setFriendListActive()}
          className="mr-3 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-rose-200 lg:hidden"
        >
          <IoClose size={22} />
        </div>
      </div>

      <h2 className="mb-4 px-4 text-xl font-semibold">Friends List</h2>

      <div className="relative h-[calc(100vh-110px)]">
        <div className="flex h-full flex-col gap-3 overflow-y-scroll px-4 pb-4">
          {/* chats */}
          {isPending
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <FriendSkeleton key={i} />)
            : filteredUsers?.flat()?.map((user: UserType) => {
                // find just active user
                const isOnline = activeUsers?.find(
                  (users: any) => users.userId === user.id,
                );

                return (
                  <Friend
                    key={user.id}
                    setFriendListActive={setFriendListActive}
                    user={user}
                    receiverId={receiverId}
                    isOnline={isOnline}
                  />
                );
              })}

          {hasNextPage && !isPending && (
            <div className="mt-3 flex justify-center">
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                className="mx-auto inline-flex shrink-0 items-end gap-1 rounded-full bg-[#703EFF] px-3 py-2 text-xs text-white"
              >
                {isFetchingNextPage && (
                  <LuLoader2 className="animate-spin" size={18} />
                )}
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;

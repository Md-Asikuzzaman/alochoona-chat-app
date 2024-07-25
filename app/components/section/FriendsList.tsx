"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import Friend from "../ui/Friend";
import FriendSkeleton from "../ui/FriendSkeleton";
import clsx from "clsx";

import { IoClose } from "react-icons/io5";
import { useFriendListActive } from "@/lib/store";
import { LuLoader2 } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const FriendsList = () => {
  const params = useParams();
  const { id } = params;
  const receiverId = id as string;

  const { data } = useSession();
  const user = data?.user as SessionType;

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
          _limitPerPage: 5,
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
      page && page.users.filter((fu: UserType) => fu.id !== user?.id),
  );

  return (
    <div
      className={clsx(
        "hiddedn 0 absolute left-0 top-0 z-[9999999] w-[280px] bg-white shadow-lg transition-transform sm:w-[400px] lg:relative lg:shadow-none",
        friendListActive
          ? "-translate-x-[110%] lg:translate-x-0"
          : "translate-x-0",
      )}
    >
      <h3 className="mb-1 flex items-center gap-3 px-4 py-3 text-2xl font-semibold text-black">
        <Avatar name={user?.username} size="35" round={true} />
        Friends List
      </h3>
      <div className="relative h-[calc(100vh-60px)]">
        {/* close button*/}
        <div
          onClick={() => setFriendListActive()}
          className="absolute right-0 flex h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-rose-200 lg:hidden"
        >
          <IoClose size={20} />
        </div>

        <div className="flex h-full flex-col gap-3 overflow-y-scroll px-4 pb-4">
          {/* chats */}
          {isPending
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <FriendSkeleton key={i} />)
            : filteredUsers
                ?.flat()
                ?.map((user: UserType) => (
                  <Friend key={user.id} user={user} receiverId={receiverId} />
                ))}

          {hasNextPage && !isPending && (
            <div className="mt-3 flex justify-center">
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                className="mx-auto inline-flex shrink-0 items-end gap-1 rounded-full bg-violet-500 px-3 py-2 text-xs text-white"
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

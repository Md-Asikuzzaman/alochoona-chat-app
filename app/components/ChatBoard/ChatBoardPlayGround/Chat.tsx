"use client";

import { NextPage } from "next";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { MdDelete } from "react-icons/md";
import moment from "moment";

import { formatDistanceToNow } from "date-fns";

interface Props {
  data: MessageType;
  currentUser: string;
}

const Chat: NextPage<Props> = ({ data, currentUser }) => {
  return (
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
      <div className="group/item flex max-w-[90%] flex-col">
        {/* <div
          onClick={() => {}}
          className={clsx(
            "grid h-6 w-6 shrink-0 translate-x-10 cursor-pointer place-content-center rounded-full bg-zinc-300  transition-transform group-hover/item:translate-x-0",
            currentUser === data.senderId ? "grid" : "hidden",
          )}
        >
          <MdDelete className="text-zinc-500" />
        </div> */}

        {/* SETUP for [text] type data */}
        {data.type === "text" && (
          <div
            className={clsx(
              "flex",
              currentUser === data.senderId ? "justify-end" : "justify-start",
            )}
          >
            <p
              className={clsx(
                "z-20 flex px-4 py-3",
                currentUser === data.senderId
                  ? "rounded-b-2xl rounded-s-2xl bg-[#6918b4] text-white"
                  : "rounded-b-2xl rounded-e-2xl bg-[#E1D1F0] text-[#8318b4]",
              )}
            >
              {data.message}
            </p>
          </div>
        )}

        <div
          className={clsx(
            "flex w-full shrink-0",
            currentUser === data.senderId ? "justify-end" : "justify-start",
          )}
        >
          <p className="mt-[2px] text-[11px] text-zinc-400">
            {moment(data.createdAt).format("llll")}
          </p>
        </div>

        {/* SETUP for [file] type data */}
        {/* {data.type === "file" && (
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
        )} */}
      </div>
    </motion.div>
  );
};

export default Chat;

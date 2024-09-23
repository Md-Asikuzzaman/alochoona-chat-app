"use client";

import { NextPage } from "next";

import { motion } from "framer-motion";
import clsx from "clsx";
import moment from "moment";
import LinkConverter from "./LinkConverter";

interface Props {
  data: MessageType;
  currentUser: string;
}

const Chat: NextPage<Props> = ({ data, currentUser }) => {
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

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
      {/* main chat layer */}
      <div className="group/item flex max-w-[90%] flex-col">
        {/* SETUP for [text] type data */}
        {data.type === "text" && (
          <div
            className={clsx(
              "relative z-20 my-1 flex items-end",
              data.message.length <= 25 ? "flex-row" : "flex-col",
              currentUser === data.senderId
                ? "rounded-b-2xl rounded-s-2xl bg-[#703EFF] text-white"
                : "rounded-b-2xl rounded-e-2xl bg-white text-[#162C4D]",
            )}
          >
            {/* Message */}
            {data.message.match(urlPattern) ? (
              <LinkConverter text={data.message} />
            ) : (
              <p
                style={{ inlineSize: "100%", wordBreak: "break-word" }}
                className={clsx(
                  "px-[14px] pt-[11px]",
                  data.message.length <= 25 ? "pb-[16px]" : "pb-[2px]",
                )}
              >
                {data.message}
              </p>
            )}

            {/* Message date */}
            <p
              className={clsx(
                "shrink-0 pb-1 pr-3 text-[11px]",
                currentUser === data.senderId
                  ? "text-[rgba(255,255,255,0.85)]"
                  : "text-[rgba(22,44,77,0.85)]",
              )}
            >
              {moment(data.createdAt).format("LT")}
            </p>
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
  );
};

export default Chat;

"use client";

import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { MdClose, MdEmojiEmotions } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { BsFillSendFill } from "react-icons/bs";
import { FaRegImage } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import EmojiPlate from "./EmojiPlate";
import { _64ify } from "next-file-64ify";

import { useSocket } from "../../providers/SocketProvider";
import { useTyping } from "@/lib/store";
import TypingIndicator from "../../ui/TypingIndicator";

interface Props {
  currentUser: string;
  scrollToBottom: () => any;
}

const ChatBoradForm: NextPage<Props> = ({ currentUser, scrollToBottom }) => {
  const [message, setMessage] = useState<string>("");
  const [emojiPlate, setEmojiPlate] = useState<boolean>(false);

  const [myFile, setMyFile] = useState<string>("");
  const [fileModal, setFileModal] = useState<boolean>(false);
  const [newMessageFromServer, setNewMessageFromServer] = useState<any>();
  const [friendOnline, setFriendOnline] = useState<boolean>(false);

  const { setIsTyping, isTyping } = useTyping();

  const queryClient = useQueryClient();

  console.log({ friendOnline });

  const { id } = useParams();
  const friendId = id;

  // socket useEffects
  const { socket } = useSocket();

  const userId = currentUser;

  useEffect(() => {
    if (socket) {
      socket.on("newMessageFromServer", (data) => {
        if (
          (data.receiverId === userId && data.senderId === friendId) ||
          (data.receiverId === friendId && data.senderId === userId)
        ) {
          setNewMessageFromServer(data);
        }
      });
    }
    if (socket) {
      socket.emit("registerUser", userId);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("updateUsers", (data) => {
        console.log(data);

        const isFriendOnline = data?.some((d: any) => d.userId === friendId);
        setFriendOnline(isFriendOnline);
      });
    }
  }, [socket, friendId]);

  // is friend typing
  useEffect(() => {
    if (socket) {
      socket.on("typing", ({ typing }) => {
        if (typing) {
          setIsTyping(typing);
        } else {
          setIsTyping(typing);
        }
      });
    }
  }, [socket]);

  // [ server ] Send a new message to the server
  const { mutate } = useMutation({
    mutationKey: ["send_message"],
    mutationFn: async (newMessage: object) => {
      const { data: message } = await axios.post("/api/messages", newMessage, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return message;
    },

    onError: (error, newMessage, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["fetch_messages"], context.previousData);
      }
    },
  });

  useEffect(() => {
    if (newMessageFromServer) {
      const newMessageWithId = {
        ...newMessageFromServer,
        id: Math.random().toString(36).substring(2, 15),
      };

      queryClient.setQueryData(["fetch_messages"], (oldData: any) => {
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: [
              {
                messages: [newMessageWithId],
              },
              ...oldData.pages,
            ],
          };
        }
        return {
          pages: [
            {
              messages: [newMessageWithId],
            },
          ],
        };
      });
    }

    scrollToBottom();
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  }, [newMessageFromServer]);

  // Optimistically update messages by the user message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      const newMessagess = {
        message,
        senderId: currentUser,
        receiverId: friendId,
        type: "text",
      };

      mutate(newMessagess);

      // only for offline mode
      if (!friendOnline) {
        const newMessageWithId = {
          ...newMessagess,
          id: Math.random().toString(36).substring(2, 15),
        };

        queryClient.setQueryData(["fetch_messages"], (oldData: any) => {
          if (oldData?.pages) {
            return {
              ...oldData,
              pages: [
                {
                  messages: [newMessageWithId],
                },
                ...oldData.pages,
              ],
            };
          }

          return {
            pages: [
              {
                messages: [newMessageWithId],
              },
            ],
          };
        });
      }

      if (socket) {
        socket.emit("newMessage", {
          message,
          senderId: currentUser,
          receiverId: friendId,
          type: "text",
        });
      }
    }
    setMessage("");
    setEmojiPlate(false);

    if (socket) {
      socket.emit("isTyping", { friendId, typing: false });
    }

    scrollToBottom();
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (socket) {
      if (e.target.value) {
        socket.emit("isTyping", { friendId, typing: true });
      } else {
        socket.emit("isTyping", { friendId, typing: false });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-2 left-0 right-0 z-50"
    >
      {isTyping && (
        <div className="flex justify-start pl-5">
          <div>
            <TypingIndicator />
          </div>
        </div>
      )}
      <div className="relative flex flex-1 items-center gap-2 p-3 pt-0">
        <div className="relative flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2">
          <label>
            <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200">
              <FaRegImage className="shrink-0 text-violet-700" size={22} />
            </div>
            <input
              hidden
              type="file"
              accept="image/jpeg, image/png"
              // onChange={handleFileChange}
            />
          </label>
          <input
            className="w-full py-3 outline-none outline-0"
            type="text"
            placeholder="Type a message here..."
            value={message}
            onChange={handleChange}
            required
          />
          <button type="submit" hidden>
            Send
          </button>
          <div
            onClick={() => setEmojiPlate((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 transition-all hover:bg-violet-200"
          >
            {!emojiPlate ? (
              <MdEmojiEmotions className="shrink-0 text-violet-700" size={24} />
            ) : (
              <MdClose className="shrink-0 text-violet-700" size={24} />
            )}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {message.length > 0 && (
            <motion.div
              initial={{ scale: 0, height: 0, width: 0 }}
              animate={{ scale: 1, height: "40px", width: "40px" }}
              exit={{ scale: 0, height: 0, width: 0 }}
              transition={{ ease: "backIn" }}
              onClick={handleSubmit}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 transition-colors hover:bg-violet-200"
            >
              <BsFillSendFill className="shrink-0 text-violet-700" size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        <EmojiPlate setMessage={setMessage} emojiPlate={emojiPlate} />

        <div
          className={clsx(
            "absolute bottom-0 right-0 z-[999999] h-auto w-[300px] -translate-x-[50px] -translate-y-[100px] rounded-lg bg-white px-4 pt-4 shadow-xl",
            fileModal ? "block" : "hidden",
          )}
        >
          <img src={myFile} alt="file" className="h-full w-full" />
          <div className="flex flex-row-reverse items-center gap-2 py-2">
            <div
              // onClick={handleFileUpload}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200"
            >
              <IoMdSend size={18} />
            </div>
            <div
              onClick={() => {
                setFileModal(false);
                setMyFile("");
              }}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200"
            >
              <MdClose size={20} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatBoradForm;

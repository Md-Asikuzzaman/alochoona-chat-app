"use client";

import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
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

import { io } from "socket.io-client";

interface Props {
  currentUser: string;
  scrollToBottom: () => void;
}

// socket hooks
export const useSocket = (userId: any, friendId: any) => {
  const socketRef = useRef<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [newMessageFromSocket, setNewMessageFromSocket] = useState<object>();
  const [targetSocketId, setTargetSocketId] = useState<object>();

  useEffect(() => {
    const newSocket = io(
      "https://realtime-chat-app-socket-production.up.railway.app",
    );
    socketRef.current = newSocket;

    if (userId) {
      newSocket.emit("registerUser", { userId, friendId });
    }

    // socket event handlers
    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("newServerMessage", ({ message, receiverId, senderId }) => {
      if (
        (receiverId === userId && senderId === friendId) ||
        (receiverId === friendId && senderId === userId)
      ) {
        setNewMessageFromSocket(message);
      }
    });

    // Find Targeted Socket
    newSocket.emit("findFriendSocket", { userId, friendId });
    newSocket.on("friendOnline", (data) => {
      setTargetSocketId(data);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    newMessageFromSocket,
    targetSocketId,
  };
};

const ChatBoradForm: NextPage<Props> = ({ currentUser, scrollToBottom }) => {
  const [message, setMessage] = useState<string>("");
  const [emojiPlate, setEmojiPlate] = useState<boolean>(false);
  const [myFile, setMyFile] = useState<string>("");
  const [fileModal, setFileModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { id } = useParams();
  const friendId = id;

  const { socket, isConnected, newMessageFromSocket, targetSocketId } =
    useSocket(currentUser, friendId);

  // Send a new message to the server
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

  // Optimistically update messages by the socket server
  useEffect(() => {
    if (isConnected && socket) {
      const newMessageWithId = {
        ...newMessageFromSocket,
        id: Math.random().toString(36).substring(2, 15),
      };

      queryClient.setQueryData(["fetch_messages"], (oldData: any) => {
        if (oldData?.pages) {
          // Prepend the new message to the beginning of the pages array
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
        // Handle the case where there are no messages yet
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
  }, [newMessageFromSocket]);

  // Optimistically update messages by the user message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMessagess = {
      message,
      senderId: currentUser,
      receiverId: friendId,
      type: "text",
    };

    if (message) {
      mutate(newMessagess);

      if (!targetSocketId) {
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

      // Calling the socket server after the button has been clicked
      if (isConnected && socket) {
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
    scrollToBottom();

    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  };

  // this method is disabled
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const { data, isLoading, isError, isValidSize } = await _64ify(
        file,
        ["image/jpeg", "image/png"],
        { minSize: 0, maxSize: 1024 },
      );
      if (data) {
        setMyFile(data);
        setFileModal(true);
      }
    }
  };

  // this method is disabled
  const handleFileUpload = () => {
    if (myFile) {
      mutate({
        message: myFile,
        senderId: currentUser,
        receiverId: friendId,
        type: "file",
      });
      setFileModal(false);
      setMyFile("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-2 left-0 right-0 z-50"
    >
      <div className="relative flex flex-1 items-center gap-2 p-3">
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
            onChange={(e) => setMessage(e.target.value)}
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

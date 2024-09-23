"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { Message } from "@prisma/client";

import axios from "axios";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _64ify } from "next-file-64ify";
import { FaRegImage } from "react-icons/fa6";

import { useSocket } from "../../providers/SocketProvider";
import EmojiPlate from "./EmojiPlate";
import { useTyping } from "@/app/stores/useTypeStore";

// Form validation
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { messageSchema } from "@/app/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import MessageSendBtn from "./MessageSendBtn";
import EmojiBtn from "./EmojiBtn";

interface Props {
  currentUser: string;
  scrollToBottom: () => any;
}

const ChatBoradForm: NextPage<Props> = ({ currentUser, scrollToBottom }) => {
  const [emojiPlate, setEmojiPlate] = useState<boolean>(false);
  const [newMessageFromServer, setNewMessageFromServer] = useState<Message>();
  const [friendOnline, setFriendOnline] = useState<boolean>(false);

  const { id: friendId } = useParams<{ id: string }>();
  const userId = currentUser;

  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { setIsTyping } = useTyping();

  // Comming new message from Socket server
  useEffect(() => {
    if (socket) {
      socket.on("newMessageFromServer", (data: Message) => {
        if (
          (data.receiverId === userId && data.senderId === friendId) ||
          (data.receiverId === friendId && data.senderId === userId)
        ) {
          setNewMessageFromServer(data);
        }
      });
    }
  }, [socket]);

  // Check is any friend is online
  useEffect(() => {
    if (socket) {
      socket.on("updateUsers", (data) => {
        const isFriendOnline = data?.some((d: any) => d.userId === friendId);
        setFriendOnline(isFriendOnline);
      });
    }

    if (socket) {
      socket.emit("registerUser", userId);
    }
  }, [socket, friendId]);

  // [ useEffect ] is user typing
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

  // ==============================================================================

  // [SEND NEW MESSAGE LOGIC]
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<messageSchemaType>({ resolver: zodResolver(messageSchema) });
  type messageSchemaType = z.infer<typeof messageSchema>;

  const message = watch("message");

  // Send new message to server
  const onSubmit: SubmitHandler<messageSchemaType> = ({ message }) => {
    if (message) {
      const newMessagess = {
        message,
        senderId: currentUser,
        receiverId: friendId,
        type: "text",
        createdAt: new Date().toISOString(),
      };

      mutate(newMessagess);

      // Optimistically update own UI by own message if friend is offline
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

      // Send messages to the Socket server is friend is online
      if (socket) {
        socket.emit("newMessage", {
          message,
          senderId: currentUser,
          receiverId: friendId,
          type: "text",
          createdAt: new Date().toISOString(),
        });
      }
    }

    setEmojiPlate(false);
    reset();

    scrollToBottom();
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  };

  // Optimistically update the UI from Socket messages
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

  // Live typing events
  useEffect(() => {
    if (socket) {
      if (message) {
        socket.emit("isTyping", { friendId, typing: true });
      } else {
        socket.emit("isTyping", { friendId, typing: false });
      }
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute bottom-2 left-0 right-0 z-50"
    >
      <div className="relative flex flex-1 items-center gap-2 p-3 pt-0">
        <div
          className={clsx(
            "relative flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2",
            errors.message?.message === "spamming" && "border border-rose-400",
          )}
        >
          {/* image view */}
          <label className="relative">
            <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200">
              <FaRegImage className="shrink-0 text-violet-700" size={22} />
            </div>
            <input disabled hidden type="file" accept="image/jpeg, image/png" />
          </label>
          {/* images send modal */}
          {/* <div className="absolute top-0 h-12 w-[400px] bg-violet-600">
            hello there
          </div> */}
          {/* image view */}

          {/* Chat input field */}
          <input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            className={clsx("w-full py-3 outline-none outline-0 bg-white")}
            type="text"
            placeholder="Type a message here..."
            {...register("message")}
          />

          <EmojiBtn emojiPlate={emojiPlate} setEmojiPlate={setEmojiPlate} />
        </div>

        <MessageSendBtn message={message} />
        <EmojiPlate
          setValue={setValue}
          message={message}
          emojiPlate={emojiPlate}
        />
      </div>
    </form>
  );
};

export default ChatBoradForm;

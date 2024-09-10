"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { GiPunchBlast } from "react-icons/gi";

interface Props {
  message: string;
}

const MessageSendBtn: NextPage<Props> = ({ message }) => {
  return (
    <AnimatePresence mode="wait">
      {message?.trim() && (
        <motion.button
          title="Punch me!"
          type="submit"
          initial={{ scale: 0, height: 0, width: 0 }}
          animate={{ scale: 1, height: "40px", width: "40px" }}
          exit={{ scale: 0, height: 0, width: 0 }}
          transition={{ ease: "backIn" }}
        >
          <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 transition-colors hover:bg-violet-200">
            <GiPunchBlast className="shrink-0 text-violet-700" size={35} />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MessageSendBtn;

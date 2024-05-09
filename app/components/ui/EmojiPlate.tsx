import { NextPage } from "next";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  emojiPlate: boolean;
}

const EmojiPlate: NextPage<Props> = ({ setMessage, emojiPlate }) => {
  const handleEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <AnimatePresence>
      {emojiPlate && (
        <motion.div
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: -128,
          }}
          exit={{
            opacity: 0,
            y: -50,
          }}
          transition={{
            ease: "backInOut",
          }}
          className="grid grid-cols-12 gap-1 absolute bg-white p-3 rounded-xl shadow-lg top-0 right-12 -translate-y-32 z-50"
        >
          <span
            onClick={() => handleEmoji("👋")}
            className="cursor-pointer text-xl select-none"
          >
            👋
          </span>
          <span
            onClick={() => handleEmoji("😆")}
            className="cursor-pointer text-xl select-none"
          >
            😆
          </span>
          <span
            onClick={() => handleEmoji("😁")}
            className="cursor-pointer text-xl select-none"
          >
            😁
          </span>
          <span
            onClick={() => handleEmoji("🤣")}
            className="cursor-pointer text-xl select-none"
          >
            🤣
          </span>
          <span
            onClick={() => handleEmoji("😅")}
            className="cursor-pointer text-xl select-none"
          >
            😅
          </span>
          <span
            onClick={() => handleEmoji("🥰")}
            className="cursor-pointer text-xl select-none"
          >
            🥰
          </span>
          <span
            onClick={() => handleEmoji("😍")}
            className="cursor-pointer text-xl select-none"
          >
            😍
          </span>
          <span
            onClick={() => handleEmoji("😵")}
            className="cursor-pointer text-xl select-none"
          >
            😵
          </span>
          <span
            onClick={() => handleEmoji("🤔")}
            className="cursor-pointer text-xl select-none"
          >
            🤔
          </span>
          <span
            onClick={() => handleEmoji("🤭")}
            className="cursor-pointer text-xl select-none"
          >
            🤭
          </span>
          <span
            onClick={() => handleEmoji("🤐")}
            className="cursor-pointer text-xl select-none"
          >
            🤐
          </span>
          <span
            onClick={() => handleEmoji("🥴")}
            className="cursor-pointer text-xl select-none"
          >
            🥴
          </span>
          <span
            onClick={() => handleEmoji("🤧")}
            className="cursor-pointer text-xl select-none"
          >
            🤧
          </span>
          <span
            onClick={() => handleEmoji("🤒")}
            className="cursor-pointer text-xl select-none"
          >
            🤒
          </span>
          <span
            onClick={() => handleEmoji("🤥")}
            className="cursor-pointer text-xl select-none"
          >
            🤥
          </span>
          <span
            onClick={() => handleEmoji("🥵")}
            className="cursor-pointer text-xl select-none"
          >
            🥵
          </span>
          <span
            onClick={() => handleEmoji("🤯")}
            className="cursor-pointer text-xl select-none"
          >
            🤯
          </span>
          <span
            onClick={() => handleEmoji("🤪")}
            className="cursor-pointer text-xl select-none"
          >
            🤪
          </span>
          <span
            onClick={() => handleEmoji("😜")}
            className="cursor-pointer text-xl select-none"
          >
            😜
          </span>
          <span
            onClick={() => handleEmoji("😎")}
            className="cursor-pointer text-xl select-none"
          >
            😎
          </span>
          <span
            onClick={() => handleEmoji("🤓")}
            className="cursor-pointer text-xl select-none"
          >
            🤓
          </span>
          <span
            onClick={() => handleEmoji("🧐")}
            className="cursor-pointer text-xl select-none"
          >
            🧐
          </span>
          <span
            onClick={() => handleEmoji("🥳")}
            className="cursor-pointer text-xl select-none"
          >
            🥳
          </span>
          <span
            onClick={() => handleEmoji("🤔")}
            className="cursor-pointer text-xl select-none"
          >
            🤔
          </span>
          <span
            onClick={() => handleEmoji("🤫")}
            className="cursor-pointer text-xl select-none"
          >
            🤫
          </span>
          <span
            onClick={() => handleEmoji("🤑")}
            className="cursor-pointer text-xl select-none"
          >
            🤑
          </span>
          <span
            onClick={() => handleEmoji("🤕")}
            className="cursor-pointer text-xl select-none"
          >
            🤕
          </span>
          <span
            onClick={() => handleEmoji("👍")}
            className="cursor-pointer text-xl select-none"
          >
            👍
          </span>
          <span
            onClick={() => handleEmoji("👊")}
            className="cursor-pointer text-xl select-none"
          >
            👊
          </span>
          <span
            onClick={() => handleEmoji("👆")}
            className="cursor-pointer text-xl select-none"
          >
            👆
          </span>
          <span
            onClick={() => handleEmoji("👇")}
            className="cursor-pointer text-xl select-none"
          >
            👇
          </span>
          <span
            onClick={() => handleEmoji("👉")}
            className="cursor-pointer text-xl select-none"
          >
            👉
          </span>
          <span
            onClick={() => handleEmoji("👈")}
            className="cursor-pointer text-xl select-none"
          >
            👈
          </span>
          <span
            onClick={() => handleEmoji("🖤")}
            className="cursor-pointer text-xl select-none"
          >
            🖤
          </span>
          <span
            onClick={() => handleEmoji("🤍")}
            className="cursor-pointer text-xl select-none"
          >
            🤍
          </span>
          <span
            onClick={() => handleEmoji("🧡")}
            className="cursor-pointer text-xl select-none"
          >
            🧡
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmojiPlate;

import { NextPage } from "next";
import { MdClose, MdEmojiEmotions } from "react-icons/md";

interface Props {
  emojiPlate: boolean;
  setEmojiPlate: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmojiBtn: NextPage<Props> = ({ emojiPlate, setEmojiPlate }) => {
  return (
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
  );
};

export default EmojiBtn;

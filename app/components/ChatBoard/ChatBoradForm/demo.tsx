import React from 'react'

const demo = () => {
  return (
    <AnimatePresence mode="wait">
      {message.trim().length > 0 && (
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

      <div>
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
    </AnimatePresence>
  );
}

export default demo
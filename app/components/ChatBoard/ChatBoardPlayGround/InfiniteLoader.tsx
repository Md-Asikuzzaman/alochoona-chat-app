"use client";

import React, { forwardRef } from "react";
import { NextPage } from "next";
import { LuLoader2 } from "react-icons/lu";

interface Props {
  fetchNextPage: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const InfiniteLoader: NextPage<Props> = ({ ref,fetchNextPage }) => {
    return (
      <div
        ref={ref}
        onClick={() => fetchNextPage()}
        className="flex justify-center"
      >
        <LuLoader2 className="animate-spin text-violet-500" size={22} />
      </div>
    );
  },
);

export default InfiniteLoader;

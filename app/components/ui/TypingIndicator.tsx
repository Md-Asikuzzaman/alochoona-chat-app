"use client";

import React from "react";

const TypingIndicator = () => {
  return (
    <div className="ticontainer mb-2 rounded-bl-full rounded-br-full rounded-tr-full bg-white px-4 py-2 shadow-sm">
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;

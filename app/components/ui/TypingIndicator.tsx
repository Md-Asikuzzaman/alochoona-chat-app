"use client";

import React from "react";

const TypingIndicator = () => {
  return (
    <div className="ticontainer mb-2 rounded-full bg-white px-2 py-1 shadow-sm">
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;

import clsx from "clsx";
import React from "react";

// Function to convert plain text URLs into clickable links
const convertUrlsToLinks = (text: string): React.ReactNode[] => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.split(urlPattern).map((part, index) => {
    // If part matches the URL pattern, wrap it in an <a> tag
    if (urlPattern.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-rose-300 hover:border-b-rose-500"
        >
          {part}
        </a>
      );
    }
    // Otherwise, return the text as is
    return part;
  });
};

interface LinkConverterProps {
  text: string;
}

const LinkConverter: React.FC<LinkConverterProps> = ({ text }) => {
  return (
    <p
      style={{ inlineSize: "100%", wordBreak: "break-word" }}
      className={clsx(
        "px-[14px] pt-[11px]",
        text.length <= 25 ? "pb-[16px]" : "pb-[2px]",
      )}
    >
      {convertUrlsToLinks(text)}
    </p>
  );
};

export default LinkConverter;

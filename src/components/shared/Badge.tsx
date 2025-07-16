import React from "react";

const Badge = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2 border-[1px] border-gray-400 px-4 py-1.5 rounded-full uppercase ">
      <div className="dot h-4 w-4 rounded-full bg-brand-primary"></div>
      <span className="text-white font-medium">
        <em>{text}</em>
      </span>
    </div>
  );
};

export default Badge;

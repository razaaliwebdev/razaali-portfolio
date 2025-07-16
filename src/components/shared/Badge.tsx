import React from "react";

const Badge = ({ text, color }: { text: string; color: string }) => {
  return (
    <span
      className={`border-[1px] uppercase flex items-center gap-2   border-slate-600 px-4 py-1.5 rounded-full`}
    >
      <div className="dot w-4 h-4 rounded-full bg-brand-primary"></div>
      <div
        className={`flex items-center font-medium text-lg gap-2 text-${color}`}
      >
        <em>{text}</em>
      </div>
    </span>
  );
};

export default Badge;

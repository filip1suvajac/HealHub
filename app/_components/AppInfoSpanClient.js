"use client";

import { IoReturnDownBackOutline } from "react-icons/io5";

export default function AppInfoSpanClient() {
  return (
    <span
      className="flex items-center gap-2 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-3 hover:cursor-pointer transition-all rounded-bd"
      onClick={() => window.history.back()}
    >
      <IoReturnDownBackOutline
        className="w-6 h-auto dark:stroke-white"
        fill="rgb(38,38,38)"
      />
      Back
    </span>
  );
}

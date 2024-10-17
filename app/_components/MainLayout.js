"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { Providers } from "../_utils/providers";

export default function MainLayout({ children, gep }) {
  return (
    <Providers>
      <div className="grid grid-cols-[21rem_1fr] grid-rows-[auto_1fr] h-dvh">
        <Header />
        <Sidebar />
        <main className="bg-blue-50 dark:bg-gray-900 p-[4rem_4.8rem_6.4rem] overflow-scroll">
          <div
            className={`max-w-[120rem] my-0 mx-auto flex flex-col gap-${gep}`}
          >
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}

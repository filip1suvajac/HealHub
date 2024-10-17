"use client";
import Logo from "./Logo";
import { IoPerson } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { usePathname } from "next/navigation"; // Correct import for app directory
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname(); // Correct hook for getting the current path

  function BarItem({ icon, text, linked }) {
    const isActive =
      pathname === `/${linked}` || pathname.includes(`${linked}`); // Adjusted the comparison

    return (
      <Link href={`/${linked}`}>
        <div
          className={`flex text-[1.04rem] items-center justify-between px-5 ${
            isActive
              ? "bg-[#dfecff] dark:bg-gray-100 font-semibold border border-[#b3c1ff]"
              : ""
          } hover:font-semibold transition-all hover:cursor-pointer bg-[#d8dffe70] py-5 rounded-sm`}
        >
          {icon}
          <li>{text}</li>
        </div>
      </Link>
    );
  }

  return (
    <aside className="border-r-2 border-blue-100 px-8 py-10 row-span-full">
      <ul className="flex flex-col text-center gap-6">
        <Logo size="180" />
        <span className="mt-6">
          <BarItem
            text="Home"
            icon={<IoMdHome className="w-6 h-auto" fill="rgb(38,38,38)" />}
            linked="home"
          />
        </span>
        <BarItem
          text="My Profile"
          icon={<IoPerson className="w-6 h-auto" fill="rgb(38,38,38)" />}
          linked="myProfile"
        />
        <BarItem
          text="My Appointments"
          icon={<FaCalendar className="w-5 h-auto" fill="rgb(38,38,38)" />}
          linked="myAppointments"
        />
      </ul>
    </aside>
  );
}

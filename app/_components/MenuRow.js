"use client";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";

export default function MenuRow({
  date,
  department,
  urgency,
  medSpec,
  link,
  grid = "grid grid-cols-[0.9fr_1.8fr_1.2fr_1.4fr_0.2fr] gap-x-6 items-center p-1 sm:p-6 border-b border-grey-100 last:border-0",
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const router = useRouter();
  function klik() {
    router.push(`/home/${link}`);
  }

  return (
    <div className={`${grid}`}>
      <div className="dark:text-white">{formatDate(date)}</div>
      <div className="dark:text-white">{department}</div>
      <div className="dark:text-white">{urgency}</div>
      <div className="dark:text-white">{medSpec}</div>
      <div
        onClick={klik}
        className="p-3 dark:text-white hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all rounded-full hover:cursor-pointer"
      >
        <FaEye
          className="w-5 mx-auto dark:fill-white h-auto"
          fill="rgb(38,38,38)"
        />
      </div>
    </div>
  );
}

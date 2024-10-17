"use client";
import { deleteAppoint } from "@/app/_lib/data-service";
import { useRouter } from "next/navigation";

export default function ButtonDelete({ niga }) {
  const router = useRouter();
  function handleDelete() {
    deleteAppoint(niga);
    router.push(`/home`);
  }

  return (
    <button
      onClick={handleDelete}
      className="py-4 mx-auto mt-5 w-2/5 bg-[#c66464d9] text-white hover:cursor-pointer hover:bg-[#984d4dd9] transition-all rounded-sm"
    >
      Cancel appointment
    </button>
  );
}

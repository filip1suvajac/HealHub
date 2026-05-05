"use client";

import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useLogout } from "../_lib/useLogout";
import LoadingSpinner from "./LoadingSpinner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getPatientAuthID } from "../_lib/data-service";
import Image from "next/image";
import { getStoredUser } from "../_lib/apiAuth";

export default function Header() {
  const { logout, isLoading } = useLogout();
  const { theme, setTheme } = useTheme(); // theme could be "dark", "light", or "system"

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [isName, setName] = useState("");
  const [isSurname, setSurname] = useState("");
  const [isPhoto, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const user = getStoredUser();

        if (!user) {
          return;
        }

        const { data, error: patientError } = await getPatientAuthID(user.id);

        if (patientError) {
          console.error("Error fetching patient data:", patientError);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No patient data found for this user.");
          return;
        }

        const patientData = data[0];
        setName(patientData.name);
        setSurname(patientData.surname);
        setPhoto(patientData.profileImageUrl);
      } catch (error) {
        console.error("Error in fetchPatientData:", error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchPatientData();
  }, []);

  return (
    <ul className="pr-8 border-b-2 border-blue-100 py-3">
      <div className="flex justify-end items-center gap-2 text-lg">
        <li className="flex items-center dark:text-white gap-3 mr-3">
          <div className="relative h-10 w-10 mr-2">
            <Image
              fill
              className="object-fit"
              src={isPhoto || "/logo.png"}
              alt="Profile Image"
            />
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>{isName ? `${isName} ${isSurname}` : "No data found"}</>
          )}
        </li>
        <li
          className="py-3 px-3 hover:bg-blue-100 transition-all hover:cursor-pointer rounded-sm"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <IoMdSunny
              className="w-6 h-auto dark:fill-white"
              fill="rgb(38,38,38)"
            />
          ) : (
            <IoMdMoon className="w-6  h-auto" fill="rgb(38,38,38)" />
          )}
        </li>
        <li
          disabled={isLoading}
          onClick={logout}
          className="py-3 px-3 hover:bg-blue-100 hover:cursor-pointer rounded-sm transition-all"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <IoLogOut
              className="w-6 h-auto dark:fill-white"
              fill="rgb(38,38,38)"
            />
          )}
        </li>
      </div>
    </ul>
  );
}

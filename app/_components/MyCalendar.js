"use client"; // This is a client-side component

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";
import { getAppointEqDate } from "../_lib/data-service";
import { useEffect, useState } from "react";

function useData(date) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      try {
        const formattedDate = date.toISOString().split("T")[0];
        const result = await getAppointEqDate(formattedDate);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [date]);

  return data;
}

export default function MyCalendar({ markedDates }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const data = useData(selectedDate);

  // Convert markedDates to YYYY-MM-DD format and sort them
  const normalizedMarkedDates = markedDates
    .map((date) => new Date(date).toISOString().split("T")[0])
    .sort((a, b) => new Date(a) - new Date(b)); // Sort dates in ascending order

  const tileContent = ({ date, view }) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (view === "month" && normalizedMarkedDates.includes(formattedDate)) {
      return <div className="marker"></div>;
    }
  };

  const handleDayClick = (date) => {
    const selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    setSelectedDate(selectedDate);
  };

  const handleBadgeClick = async (date) => {
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const result = await getAppointEqDate(formattedDate);

      if (result && result.length > 0) {
        const { id } = result[0]; // Assuming id exists in the result
        router.push(`/home/${id}`);
      } else {
        console.error("No appointment found for this date");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex justify-center items-center p-5 box-border">
        <Calendar
          tileContent={tileContent}
          showNeighboringMonth={false}
          onClickDay={handleDayClick}
        />
      </div>
      <div className="marked-dates text-lg mt-4">
        {normalizedMarkedDates.length > 0 ? (
          <>
            <p className="mb-3 dark:text-white">
              These are your appointment dates:
            </p>
            <div className="date-badges">
              {normalizedMarkedDates.map((date, index) => (
                <span
                  key={index}
                  className="date-badge hover:cursor-pointer"
                  onClick={() => handleBadgeClick(date)}
                >
                  📅 {new Date(date).toLocaleDateString("en-CA")}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p>You have no booked appointments.</p>
        )}
      </div>
    </div>
  );
}

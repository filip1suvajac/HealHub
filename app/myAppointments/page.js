"use client";
// app/myAppointments/page.js
import ProtectedRoute from "../_components/ProtectedRoute"; // Adjust path
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MainLayout from "../_components/MainLayout";
import { getDates } from "../_lib/data-service";

const MyCalendar = dynamic(() => import("../_components/MyCalendar"), {
  ssr: false,
});

export default function Page() {
  const [markedDates, setMarkedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        const markedDatesData = await getDates();
        const validDates = markedDatesData
          .filter((item) => item.date)
          .map((item) => item.date);

        setMarkedDates(validDates);
      } catch (error) {
        console.error("Error fetching dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center  justify-center">
          <p className="dark:text-white">Loading calendar...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <MyCalendar markedDates={markedDates} />
      </MainLayout>
    </ProtectedRoute>
  );
}

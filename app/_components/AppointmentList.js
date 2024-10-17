"use client";
import { useEffect, useState } from "react";
import { getAppoints, getAppointsThree } from "../_lib/data-service";
import MenuRow from "./MenuRow";

export default function AppointmentsList({ grid, three = false }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // For handling loading state

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Start loading
      let data;
      if (three) {
        data = await getAppointsThree(); // Fetch limited appointments
      } else {
        data = await getAppoints(); // Fetch all appointments
      }
      setAppointments(data); // Set the fetched data
      setLoading(false); // Stop loading
    };

    fetchAppointments(); // Fetch appointments on mount or when `three` changes
  }, [three]); // Dependency array ensures this runs when `three` changes

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <p>Loading appointments...</p>
      </div>
    );
  }

  // Handle case when no appointments are found
  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <p>You have no scheduled appointments.</p>
      </div>
    );
  }

  // Render appointments using `MenuRow`
  return appointments.map((appointment) => (
    <MenuRow
      key={appointment.id}
      date={appointment.date}
      department={appointment.department}
      urgency={appointment.urgency}
      medSpec={appointment.med_spec}
      link={appointment.id}
      grid={grid}
    />
  ));
}

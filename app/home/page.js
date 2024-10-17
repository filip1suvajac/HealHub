"use client";
import { memo, useEffect, useState } from "react";
import DataMenu from "../_components/DataMenu";
import MainLayout from "../_components/MainLayout";
import PageHeading from "../_components/PageHeading";
import { createAppt } from "../_lib/data-service";
import ProtectedRoute from "../_components/ProtectedRoute";
import supabase from "../_lib/supabase";

const departs = [
  "Cardiology (Heart Health)",
  "Dermatology (Skin Care)",
  "Family Medicine (General Health)",
  "Gastroenterology (Digestive System)",
  "Gynecology (Women's Health)",
  "Neurology (Nervous System)",
  "Orthopedics (Bone and Joints)",
  "Pediatrics (Child Health)",
  "Psychiatry (Mental Health)",
  "Urology (Urinary System)",
];

const specs = [
  "Dr. Amelia Sanders",
  "Dr. Benjamin Matthews",
  "Dr. Charlotte Hughes",
  "Dr. Daniel Foster",
  "Dr. Evelyn Bennett",
  "Dr. George Marshall",
  "Dr. Hannah Reed",
  "Dr. Isaac Peterson",
  "Dr. Julia Morgan",
  "Dr. Kevin Ramirez",
];

const drugo = [
  "Routine Check-Up",
  "Minor Issue",
  "Moderate Concern",
  "Urgent",
  "Emergency",
];

const Page = memo(function Page() {
  const [desc, setDesc] = useState("");
  const [department, setDepartment] = useState("");
  const [urgency, setUrgency] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [patientId, setPatientId] = useState(null); // State for patient ID
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);

    async function fetchPatientId() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        return;
      }

      const user = session?.user;
      if (user) {
        const { data, error } = await supabase
          .from("patients")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();

        if (data) {
          setPatientId(data.id);
        } else {
          console.error("Error fetching patient ID:", error);
        }
      }
    }

    fetchPatientId();
  }, []);

  const med_spec = getRandomDoctor();
  const date = getRandomDate();

  async function handleBooking() {
    if (!patientId) {
      alert("Unable to make an appointment. Please try again later.");
      return;
    }

    const newapt = {
      desc,
      department,
      urgency,
      med_spec,
      date,
      auth_user: patientId,
    };

    setLoading(true);
    await createAppt(newapt);
    setLoading(false);
  }

  function getRandomDoctor() {
    const randomIndex = Math.floor(Math.random() * specs.length);
    return specs[randomIndex];
  }

  function getRandomDate() {
    const today = new Date();
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);

    const randomTime =
      today.getTime() +
      Math.random() * (twoYearsFromNow.getTime() - today.getTime());
    const randomDate = new Date(randomTime);

    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const day = String(randomDate.getDate()).padStart(2, "0");
    const year = randomDate.getFullYear();

    return `${month}/${day}/${year}`;
  }

  const Select = memo(({ placeholder, value, onChange, options }) => {
    return (
      <div className="relative dark:text-white">
        <select
          value={value}
          onChange={onChange}
          className="block appearance-none w-80 bg-white border text-[rgb(38,38,38)] border-[rgb(54,54,54)] hover:border-gray-500 px-4 py-4 pr-8 rounded-sm focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  });

  Select.displayName = "Select";

  return (
    <ProtectedRoute>
      <MainLayout gep="2">
        <PageHeading size="3xl" text="Schedule Your Next Appointment" />
        <h1 className="text-2xl font-semibold dark:text-white text-neutral-800">
          Your Path to Better Health Starts Here
        </h1>
        <div className="flex items-center mx-auto gap-5 mt-10">
          <input
            type="text"
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Shortly describe your need"
            className="w-80 bg-white border text-[rgb(38,38,38)] border-[rgb(54,54,54)] hover:border-gray-500 px-4 py-4 pr-8 rounded-sm focus:outline-none focus:shadow-outline"
          />
          <Select
            options={departs}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Choose the service you need"
          />
          <Select
            options={drugo}
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            placeholder="Select the urgency of your needs"
          />
        </div>
        <button
          onClick={handleBooking}
          className="py-4 mx-auto mt-5 w-2/5 bg-[#5b8b7e] dark:bg-gray-500 dark:hover:bg-gray-600 text-white hover:cursor-pointer transition-all hover:bg-[#3d5e55] rounded-sm"
          disabled={loading || !patientId}
        >
          {loading ? "Loading..." : "Book your appointment"}
        </button>
        {clientReady && <DataMenu />}
      </MainLayout>
    </ProtectedRoute>
  );
});

export default Page;

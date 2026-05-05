"use client";

import AppInfoSpanClient from "@/app/_components/AppInfoSpanClient";
import ButtonDelete from "@/app/_components/ButtonDelete";
import MainLayout from "@/app/_components/MainLayout";
import PageHeading from "@/app/_components/PageHeading";
import { getAppoint, updateAppoint } from "@/app/_lib/data-service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const urgencies = [
  "Routine Check-Up",
  "Minor Issue",
  "Moderate Concern",
  "Urgent",
  "Emergency",
];

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [appointment, setAppointment] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAppointment() {
      try {
        const data = await getAppoint(id);
        setAppointment(data);
        setFormValues(data);
      } catch (error) {
        console.error("Error loading appointment:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAppointment();
  }, [id]);

  function handleChange(field, value) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const updated = await updateAppoint(id, formValues);
    setAppointment(updated);
    setFormValues(updated);
    setIsEditing(false);
    setSaving(false);
  }

  if (loading) {
    return (
      <MainLayout gep="2">
        <p className="dark:text-white">Loading appointment...</p>
      </MainLayout>
    );
  }

  if (!appointment) {
    return (
      <MainLayout gep="2">
        <p className="dark:text-white">No data available</p>
      </MainLayout>
    );
  }

  const shown = isEditing ? formValues : appointment;

  return (
    <MainLayout gep="2">
      <div className="p-8 bg-white dark:bg-gray-600 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <PageHeading text={`Appointment #${id}`} size="2xl" />
          <AppInfoSpanClient />
        </div>

        <div className="flex flex-col gap-3">
          <Field
            label="Date of the appointment"
            value={shown.date}
            editing={isEditing}
            type="date"
            onChange={(value) => handleChange("date", value)}
          />
          <Field
            label="Medical specialist in charge"
            value={shown.med_spec}
            editing={isEditing}
            options={specs}
            onChange={(value) => handleChange("med_spec", value)}
          />
          <Field
            label="Urgency of the appointment"
            value={shown.urgency}
            editing={isEditing}
            options={urgencies}
            onChange={(value) => handleChange("urgency", value)}
          />
          <Field
            label="Department of the appointment"
            value={shown.department}
            editing={isEditing}
            options={departs}
            onChange={(value) => handleChange("department", value)}
          />
          <Field
            label="Short description of the illness/state"
            value={shown.desc}
            editing={isEditing}
            onChange={(value) => handleChange("desc", value)}
          />
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="py-4 mt-5 w-1/4 bg-[#5b8b7e] text-white hover:cursor-pointer hover:bg-[#3d5e55] transition-all rounded-sm"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={() => {
                setFormValues(appointment);
                setIsEditing(false);
              }}
              className="py-4 mt-5 w-1/4 bg-gray-500 text-white hover:cursor-pointer hover:bg-gray-600 transition-all rounded-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="py-4 mt-5 w-1/4 bg-[#5b8b7e] text-white hover:cursor-pointer hover:bg-[#3d5e55] transition-all rounded-sm"
          >
            Edit appointment
          </button>
        )}
      </div>

      <ButtonDelete niga={id} />
    </MainLayout>
  );
}

function Field({ label, value, editing, onChange, options, type = "text" }) {
  return (
    <label className="dark:text-gray-200">
      {label}:{" "}
      {editing ? (
        options ? (
          <select
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            className="ml-2 border p-2 rounded-sm text-neutral-800"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            className="ml-2 border p-2 rounded-sm text-neutral-800"
          />
        )
      ) : (
        <span className="font-semibold dark:text-white">{value}</span>
      )}
    </label>
  );
}

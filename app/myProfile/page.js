"use client";
import AppointmentsList from "../_components/AppointmentList";
import MainLayout from "../_components/MainLayout";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { getPatientAuthID, updatePatientDetails } from "../_lib/data-service";
import Image from "next/image";
import { getStoredUser } from "../_lib/apiAuth";

// Component for input fields when in edit mode
function EditInput({ setterFunc, placeholderText, type = "text", value }) {
  return (
    <input
      type={type}
      className="border p-2 rounded dark:text-white w-full"
      onChange={(e) => setterFunc(e.target.value)}
      placeholder={placeholderText}
      value={value || ""}
    />
  );
}

export default function Page() {
  // Local state for managing user data
  const [isEditMode, setEditMode] = useState(false);
  const [isName, setName] = useState("");
  const [isSurname, setSurname] = useState("");
  const [isDate, setDate] = useState("");
  const [isID, setID] = useState("");
  const [isPhoto, setPhoto] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch patient data when the component mounts
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

        // Assuming the `data` array returns one object, access it like data[0]
        const patientData = data[0];
        setName(patientData.name);
        setSurname(patientData.surname);
        setDate(patientData.birthDate); // Assuming it's stored as YYYY-MM-DD
        setID(patientData.medicalID);
        setPhoto(patientData.profileImageUrl);
      } catch (error) {
        console.error("Error in fetchPatientData:", error);
      } finally {
        setLoading(false); // Data fetching is complete
      }
    };

    fetchPatientData();
  }, []);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result); // Sets the new image URL after upload
      };
      reader.readAsDataURL(file);
    }
  };

  // New patient data for the update
  const newPatientData = {
    name: isName,
    surname: isSurname,
    birthDate: isDate,
    medicalID: isID,
    profileImageUrl: isPhoto,
  };

  // Toggle edit mode and save data if editing is done
  function handleEdit(e) {
    e.preventDefault();
    if (isEditMode) {
      updatePatientDetails(newPatientData).then((result) => {
        if (result.error) {
          console.error("Error updating patient details:", result.error);
        }
      });
    }
    setEditMode(!isEditMode); // Toggle edit mode
  }

  // Display loading message while fetching data
  if (loading) {
    return <p>Loading patient data...</p>;
  }

  // Main profile page content
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="flex gap-24 bg-white dark:bg-gray-600 border border-gray-300 px-20 py-10 mx-auto">
          <div className="flex flex-col text-center items-center w-full">
            <div className="relative flex justify-center items-center h-40 w-40  rounded-full overflow-hidden mb-11">
              <Image
                src={isPhoto || "/logo.png"}
                alt="Profile Image"
                className="object-cover rounded-full"
                fill
              />
              {isEditMode && (
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                  <FaRegEdit className="text-white text-3xl" />
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-5 items-center">
              {/* Name */}
              <h2 className="w-full">
                <span className="flex items-center justify-center gap-4 w-full">
                  {isEditMode && (
                    <FaRegEdit
                      className="w-6 dark:fill-white h-auto"
                      fill="rgb(38,38,38)"
                    />
                  )}
                  <span className="font-semibold dark:text-white">Name:</span>
                  {isEditMode ? (
                    <div className="flex-1">
                      <EditInput
                        setterFunc={setName}
                        placeholderText="John"
                        value={isName}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold dark:text-white">
                      {isName}
                    </span>
                  )}
                </span>
              </h2>

              <hr className="w-full" />

              {/* Surname */}
              <h2 className="w-full">
                <span className="flex items-center justify-center gap-4 w-full">
                  {isEditMode && (
                    <FaRegEdit
                      className="w-6 dark:fill-white h-auto"
                      fill="rgb(38,38,38)"
                    />
                  )}
                  <span className="font-semibold dark:text-white">
                    Surname:
                  </span>
                  {isEditMode ? (
                    <div className="flex-1">
                      <EditInput
                        setterFunc={setSurname}
                        placeholderText="Doe"
                        value={isSurname}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold dark:text-white">
                      {isSurname}
                    </span>
                  )}
                </span>
              </h2>

              <hr className="w-full" />

              {/* Birth date */}
              <h2 className="w-full">
                <span className="flex items-center justify-center gap-4 w-full">
                  {isEditMode && (
                    <FaRegEdit
                      className="w-6 dark:fill-white h-auto"
                      fill="rgb(38,38,38)"
                    />
                  )}
                  <span className="font-semibold dark:text-white">
                    Birth date:
                  </span>
                  {isEditMode ? (
                    <div className="flex-1">
                      <EditInput
                        setterFunc={setDate}
                        placeholderText="1/1/2000"
                        type="date"
                        value={isDate}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold dark:text-white">
                      {isDate}
                    </span>
                  )}
                </span>
              </h2>

              <hr className="w-full" />

              {/* Medical ID */}
              <h2 className="w-full">
                <span className="flex items-center justify-center gap-4 w-full">
                  {isEditMode && (
                    <FaRegEdit
                      className="w-6 dark:fill-white h-auto"
                      fill="rgb(38,38,38)"
                    />
                  )}
                  <span className="font-semibold dark:text-white">
                    Medical ID:
                  </span>
                  {isEditMode ? (
                    <div className="flex-1">
                      <EditInput
                        setterFunc={setID}
                        placeholderText="12345678"
                        type="number"
                        value={isID}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold dark:text-white">
                      {isID}
                    </span>
                  )}
                </span>
              </h2>
            </div>
          </div>

          {/* Last Appointments List */}
          <div className="flex flex-col my-auto">
            <h2 className="font-semibold text-xl text-center dark:text-white mb-7">
              Your last scheduled appointments:
            </h2>
            <AppointmentsList
              three={true}
              grid="grid text-lg grid-cols-1 space-y-1 mb-12 last:mb-0 text-center items-center"
            />
          </div>
        </div>

        {/* Edit/Save button */}
        <button
          onClick={handleEdit}
          className="py-4 mx-auto mt-5 w-1/3 bg-[#5b8b7e] dark:bg-gray-500 text-white rounded-sm"
        >
          {isEditMode ? "Save changes" : "Edit your profile"}
        </button>
      </MainLayout>
    </ProtectedRoute>
  );
}

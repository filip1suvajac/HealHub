"use client";
import { useState } from "react";
import { createUser, getAuthEmails } from "../_lib/data-service"; // Adjust import as necessary for your project

export default function NewAccForm() {
  const [password, setPassword] = useState("");
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    surname: "",
    medID: "",
    email: "",
    birthDate: "",
  });

  // Handle password change and validation
  function handlePasswordChange(e) {
    const { value } = e.target;
    setPassword(value);
    setValidLength(value.length >= 6);
    setHasNumber(/\d/.test(value));
    setHasUppercase(/[A-Z]/.test(value));
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle image file input change for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const emails = await getAuthEmails();
      if (emails.includes(formValues.email)) {
        setError("Account with this email already exists!");
        setLoading(false);
        return;
      }

      const userData = await createUser(
        formValues.email,
        password,
        formValues.birthDate,
        formValues.name,
        formValues.surname,
        formValues.medID,
        profileImage // Pass the profile image to createUser
      );

      setSuccess(true);
      setLoading(false);
      console.log("User created successfully", userData);
    } catch (err) {
      setLoading(false);
      setError(err.message || "An error occurred");
      console.error("Error creating user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex  flex-col gap-2 text-lg items-center justify-center">
        {/* Name input */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formValues.name}
          onChange={handleInputChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Surname input */}
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formValues.surname}
          onChange={handleInputChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Medical ID input */}
        <input
          type="text"
          name="medID"
          placeholder="Medical ID"
          value={formValues.medID}
          onChange={handleInputChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleInputChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Date of Birth input */}
        <input
          type="date"
          name="birthDate"
          value={formValues.birthDate}
          onChange={handleInputChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Profile Image Upload */}
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
        />

        {/* Validation messages */}
        <div>
          {validLength ? "✅ " : "❌ "}At least 6 characters <br />
          {hasNumber ? "✅ " : "❌ "}Contains a number <br />
          {hasUppercase ? "✅ " : "❌ "}Contains an uppercase letter
        </div>

        {/* Error message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-96 py-3 px-5 bg-blue-500 text-white border-none cursor-pointer"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Success message */}
        {success && (
          <div className="text-green-500">Account created successfully!</div>
        )}
      </div>
    </form>
  );
}

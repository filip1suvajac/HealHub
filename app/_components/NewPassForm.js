"use client";
import { useState } from "react";
import { updatePassword } from "../_lib/data-service"; // Your data-service file
import { useRouter } from "next/navigation"; // For redirecting after success

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidLength(value.length >= 6);
    setHasNumber(/\d/.test(value));
    setHasUppercase(/[A-Z]/.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validLength || !hasNumber || !hasUppercase) {
      setError("Password does not meet the requirements.");
      setLoading(false);
      return;
    }

    try {
      // 1. Get email from the query parameters to identify the user
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      if (!email) {
        throw new Error("No email found. Please try again.");
      }

      // 2. Update the password for the user with the provided email
      await updatePassword(password, email); // Modify the updatePassword function to handle email-based updating

      setSuccess(true);
      setTimeout(() => {
        router.push("/"); // Redirect to login after success
      }, 2000);
    } catch (err) {
      setError(err.message || "Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex text-lg items-center justify-center flex-col gap-2">
        <input
          className="w-96 bg-slate-100 py-3 px-5 mb-3 border-black"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="New Password"
          required
        />
        <div className="flex flex-col text-sm justify-center text-center">
          <h3 className="text-white">Password must:</h3>
          <ul className="text-slate-300">
            <li className={validLength ? "text-green-500" : "text-red-300"}>
              - have at least 6 characters
            </li>
            <li className={hasNumber ? "text-green-500" : "text-red-300"}>
              - have at least one number
            </li>
            <li className={hasUppercase ? "text-green-500" : "text-red-300"}>
              - have at least one uppercase letter
            </li>
          </ul>
        </div>
        <button
          className="py-2 px-7 mt-2 bg-[#5b8b7e] text-white rounded-sm"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 mt-2">
            Password updated successfully! Redirecting...
          </p>
        )}
      </div>
    </form>
  );
}

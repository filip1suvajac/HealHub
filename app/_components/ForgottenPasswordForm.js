"use client";
import { useState } from "react";
import { getAuthEmails } from "../_lib/data-service"; // Import the function to get emails

export default function ForgottenPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch all emails from the Supabase authentication system
      const emails = await getAuthEmails();

      if (!emails.includes(email)) {
        setError("Email not found in the system.");
      } else {
        // Redirect to the reset password form if the email is valid
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `/resetPassword?email=${encodeURIComponent(
            email
          )}`;
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Error checking email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex text-lg items-center justify-center flex-col gap-2">
        <input
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
          type="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
        <button
          className="py-2 px-7 mt-2 bg-[#5b8b7e] text-white rounded-sm"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Email"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 mt-2">
            Email found! Redirecting to reset password form...
          </p>
        )}
      </div>
    </form>
  );
}

"use client"; // Make sure this component is a Client Component

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../_lib/apiAuth";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function LoginForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [formError, setFormError] = useState(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      router.push("/home");
    },
    onError: (err) => {
      console.error("ERROR", err);
      toast.error("Provided email or password are incorrect");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    setFormError(null);
    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex text-lg items-center justify-center flex-col gap-2">
        <input
          className="w-96 py-3 px-5 bg-slate-100 border-black focus:shadow-md"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="w-96 bg-slate-100 py-3 px-5 mb-3 border-black"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {formError && <p className="text-red-500">{formError}</p>}

        {isPending ? (
          <button
            className="py-2 px-7 bg-[#5b8b7e] text-white rounded-sm"
            disabled
          >
            <span className="spinner"></span> {/* Add your spinner here */}
          </button>
        ) : (
          <button className="py-2 px-7 bg-[#5b8b7e] text-white rounded-sm">
            Login
          </button>
        )}
      </div>

      {/* Add CSS for the spinner */}
      <style jsx>{`
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-top: 2px solid white;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </form>
  );
}

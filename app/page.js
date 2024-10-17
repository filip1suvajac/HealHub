"use client";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import Logo from "./_components/Logo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center justify-center min-h-screen gap-7 bg-[#2C3E50]">
        <Logo />
        <LoginForm />
        <div className="flex flex-col gap-3 text-center mt-4">
          <Link href="/newAccount">
            <span className="text-slate-300">
              Don&apos;t have an account? Click to sign up.
            </span>
          </Link>
          <Link href="/forgottenPassword">
            <span className="text-slate-300">Forgot your password?</span>
          </Link>
        </div>
      </div>
    </QueryClientProvider>
  );
}

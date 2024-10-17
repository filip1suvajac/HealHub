import Logo from "../_components/Logo";
import ResetPasswordForm from "../_components/NewPassForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-7 bg-[#2C3E50]">
      <Logo />
      <ResetPasswordForm />
    </div>
  );
}

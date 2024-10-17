import ForgottenPasswordForm from "../_components/ForgottenPasswordForm";
import Logo from "../_components/Logo";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-7 bg-[#2C3E50]">
      <Logo />
      <ForgottenPasswordForm />
    </div>
  );
}

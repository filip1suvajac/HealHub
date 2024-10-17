import Logo from "../_components/Logo";
import NewAccForm from "../_components/NewAccForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-7 bg-[#2C3E50]">
      <Logo />
      <NewAccForm />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

function Logo({ size = 270 }) {
  return (
    <Link href="/home" className="flex items-center justify-center gap-4 z-10">
      <Image
        src={logo}
        height={size}
        placeholder="blur"
        quality={100}
        width={size}
        alt="The Wild Oasis logo"
      />
    </Link>
  );
}

export default Logo;

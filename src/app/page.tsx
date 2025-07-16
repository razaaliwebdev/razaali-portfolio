import { assets } from "@/Assets/assets";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen bg-brand-bg">
      <Image src={assets.logo} width={200} alt="logo" />
    </div>
  );
}

import Hero from "@/components/home/Hero";
import Contributions from "@/components/home/Contributions";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <Hero />
      <Contributions />
    </main>
  );
}

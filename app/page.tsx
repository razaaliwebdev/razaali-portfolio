import Hero from "@/components/home/Hero";
import Skills from "@/components/home/Skills";
import Contributions from "@/components/home/Contributions";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <Hero />
      <Skills />
      <Contributions />
    </main>
  );
}

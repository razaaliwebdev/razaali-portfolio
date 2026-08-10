export default function Home() {
  return (
    <div className="flex flex-col items-center py-12 h-screen">
      <h1>Raza Ali Portfolio</h1>
      <p>I m a Full Stack Developer</p>
      <a
        href="/file/Raza_Ali_resume.pdf"
        download="Raza_Ali_Resume.pdf"
        className="inline-block bg-primary px-6 py-1.5 text-neutral my-4"
      >
        $Download CV
      </a>
    </div>
  );
}

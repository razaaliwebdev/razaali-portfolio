export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center py-12">
      <h1>Raza Ali Portfolio</h1>
      <p>I m a Full Stack Developer</p>
      <a
        href="/file/Raza_Ali_resume.pdf"
        download="Raza_Ali_Resume.pdf"
        className="btn my-4"
      >
        $Download CV
      </a>
    </div>
  );
}

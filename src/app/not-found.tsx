import Link from "next/link";

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-brand-bg">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="mt-4">
        Page not found. Go back to{" "}
        <Link href="/" className="text-brand-primary/70 ">
          Home
        </Link>
      </p>
    </div>
  );
}

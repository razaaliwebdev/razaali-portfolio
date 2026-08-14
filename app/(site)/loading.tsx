import TerminalLoader from "@/components/TerminalLoader";

/**
 * App Router built-in loading UI — shown while routes / data resolve.
 * autoDismiss stays off; Next.js unmounts this when the segment is ready.
 */
export default function Loading() {
  return <TerminalLoader blocks={24} duration={2000} />;
}

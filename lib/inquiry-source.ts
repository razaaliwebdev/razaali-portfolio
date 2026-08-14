export const INQUIRY_SOURCES = [
  "contact",
  "services",
  "projects",
  "home",
] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export function isInquirySource(value: string): value is InquirySource {
  return (INQUIRY_SOURCES as readonly string[]).includes(value);
}

export function normalizeInquirySource(value: unknown): InquirySource {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  return isInquirySource(raw) ? raw : "contact";
}

/** Build /contact URL with tracking + optional subject prefill */
export function contactHref(input?: {
  source?: InquirySource;
  ref?: string;
  topic?: string;
}) {
  const params = new URLSearchParams();
  if (input?.source && input.source !== "contact") {
    params.set("source", input.source);
  }
  if (input?.ref) params.set("ref", input.ref);
  if (input?.topic) params.set("topic", input.topic);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}

export function formatInquirySource(source: string, sourceRef?: string) {
  const ref = sourceRef?.trim();
  if (source === "services") {
    return ref ? `services · ${ref}` : "services";
  }
  if (source === "projects") {
    return ref ? `projects · ${ref}` : "projects";
  }
  if (source === "home") return "home";
  return "contact";
}

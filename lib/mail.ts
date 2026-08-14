import nodemailer from "nodemailer";
import { absoluteUrl } from "@/lib/seo";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

const SITE_URL = absoluteUrl("/").replace(/\/$/, "");

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  return nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port,
    secure,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASS"),
    },
  });
}

export async function sendMail(input: SendMailInput) {
  if (!isMailConfigured()) {
    throw new Error("Email is not configured. Add SMTP_* keys to .env.");
  }

  const transport = createTransport();
  const from = required("SMTP_FROM");

  await transport.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });
}

export function adminNotifyEmail() {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    ""
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nl2br(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br/>");
}

/** Shared terminal-style shell (inline CSS — email clients strip <style>) */
function emailShell(input: {
  eyebrow: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
  footerHtml?: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:#0b0e14;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e14;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:1px solid #30363d;background:#0f131a;">
          <tr>
            <td style="background:#1a1f2a;border-bottom:1px solid #30363d;padding:12px 16px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FF5F57;margin-right:6px;"></span>
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FEBC2E;margin-right:6px;"></span>
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#28C840;margin-right:10px;"></span>
              <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:#8b949e;">${escapeHtml(input.eyebrow)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#e6edf3;font-size:14px;line-height:1.65;">
              <p style="margin:0 0 8px;color:#3fb950;font-size:12px;">// ${escapeHtml(input.eyebrow)}</p>
              <h1 style="margin:0 0 18px;font-size:20px;font-weight:600;color:#e6edf3;">${escapeHtml(input.title)}</h1>
              ${input.bodyHtml}
              <p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #30363d;color:#8b949e;font-size:12px;">
                — Raza Ali<br/>
                Full Stack Developer · <a href="${SITE_URL}" style="color:#58a6ff;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
              </p>
              ${
                input.footerNote
                  ? `<p style="margin:12px 0 0;color:#6e7681;font-size:11px;">${escapeHtml(input.footerNote)}</p>`
                  : ""
              }
              ${input.footerHtml ?? ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function inquiryConfirmationEmail(input: {
  name: string;
  subject: string;
}) {
  const first = input.name.trim().split(/\s+/)[0] || "there";
  const subject = `We got your message — ${input.subject}`;
  const text = [
    `Hi ${first},`,
    "",
    "Thanks for reaching out via razaali.dev.",
    `I received your message about "${input.subject}" and will reply as soon as I can.`,
    "",
    "— Raza Ali",
    "Full Stack Developer",
    SITE_URL,
  ].join("\n");

  const html = emailShell({
    eyebrow: "confirmation",
    title: "Message received",
    bodyHtml: `
      <p style="margin:0 0 12px;">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 12px;color:#8b949e;">Thanks for reaching out via <span style="color:#3fb950;">razaali.dev</span>.</p>
      <p style="margin:0 0 12px;">I received your message about <strong style="color:#ffa657;">${escapeHtml(input.subject)}</strong> and will reply as soon as I can.</p>
    `,
    footerNote: "You’re receiving this because you submitted the contact form.",
  });

  return { subject, text, html };
}

export function inquiryAdminAlertEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryId: string;
  source?: string;
  sourceRef?: string;
}) {
  const sourceLabel = input.sourceRef
    ? `${input.source ?? "contact"} · ${input.sourceRef}`
    : input.source || "contact";
  const subject = `[Inquiry] ${input.subject} — ${input.name}`;
  const adminUrl = `${SITE_URL}/admin/inquiries/${input.inquiryId}`;
  const text = [
    "New inquiry on razaali.dev",
    "",
    `From: ${input.name} <${input.email}>`,
    `Subject: ${input.subject}`,
    `Source: ${sourceLabel}`,
    "",
    input.message,
    "",
    `Open in admin: ${adminUrl}`,
  ].join("\n");

  const html = emailShell({
    eyebrow: "inbox · new",
    title: "New inquiry",
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border:1px solid #30363d;background:#0b0e14;">
        <tr>
          <td style="padding:10px 12px;color:#8b949e;font-size:12px;border-bottom:1px solid #30363d;width:88px;">From</td>
          <td style="padding:10px 12px;border-bottom:1px solid #30363d;">
            ${escapeHtml(input.name)}
            &lt;<a href="mailto:${escapeHtml(input.email)}" style="color:#58a6ff;text-decoration:none;">${escapeHtml(input.email)}</a>&gt;
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;color:#8b949e;font-size:12px;border-bottom:1px solid #30363d;">Subject</td>
          <td style="padding:10px 12px;border-bottom:1px solid #30363d;color:#ffa657;">${escapeHtml(input.subject)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;color:#8b949e;font-size:12px;border-bottom:1px solid #30363d;">Source</td>
          <td style="padding:10px 12px;border-bottom:1px solid #30363d;color:#3fb950;">${escapeHtml(sourceLabel)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;color:#8b949e;font-size:12px;vertical-align:top;">Message</td>
          <td style="padding:10px 12px;color:#e6edf3;">${nl2br(input.message)}</td>
        </tr>
      </table>
      <a href="${adminUrl}" style="display:inline-block;padding:10px 14px;background:#3fb950;color:#0b0e14;text-decoration:none;font-weight:600;font-size:13px;">
        Open in admin →
      </a>
    `,
  });

  return { subject, text, html };
}

export function inquiryReplyEmail(input: {
  body: string;
  title?: string;
}) {
  const text = input.body;
  const html = emailShell({
    eyebrow: "reply",
    title: input.title || "Reply from Raza",
    bodyHtml: `
      <div style="margin:0;padding:14px 16px;border:1px solid #30363d;background:#0b0e14;color:#e6edf3;">
        ${nl2br(input.body)}
      </div>
    `,
  });

  return { text, html };
}

export function newsletterWelcomeEmail(input: {
  email: string;
  unsubscribeToken: string;
}) {
  const unsubUrl = `${SITE_URL}/newsletter/unsubscribe?token=${encodeURIComponent(input.unsubscribeToken)}`;
  const subject = "You're on the list — razaali.dev";
  const text = [
    "You're subscribed to updates from Raza Ali.",
    "",
    "Occasionally I'll share projects, notes, and useful builds — no spam.",
    "",
    `Unsubscribe anytime: ${unsubUrl}`,
    "",
    "— Raza Ali",
    SITE_URL,
  ].join("\n");

  const html = emailShell({
    eyebrow: "newsletter · welcome",
    title: "You're subscribed",
    bodyHtml: `
      <p style="margin:0 0 12px;">Thanks for joining the list.</p>
      <p style="margin:0 0 12px;color:#8b949e;">I'll occasionally share projects, notes, and useful builds from <span style="color:#3fb950;">razaali.dev</span> — no spam, no weekly noise.</p>
    `,
    footerNote: "You're receiving this because you subscribed on the site.",
    footerHtml: `<p style="margin:10px 0 0;font-size:11px;"><a href="${unsubUrl}" style="color:#6e7681;">Unsubscribe</a></p>`,
  });

  return { subject, text, html };
}

export function newsletterCampaignEmail(input: {
  subject: string;
  body: string;
  unsubscribeToken: string;
}) {
  const unsubUrl = `${SITE_URL}/newsletter/unsubscribe?token=${encodeURIComponent(input.unsubscribeToken)}`;
  const text = [
    input.body,
    "",
    "— Raza Ali",
    SITE_URL,
    "",
    `Unsubscribe: ${unsubUrl}`,
  ].join("\n");

  const html = emailShell({
    eyebrow: "newsletter",
    title: input.subject,
    bodyHtml: `
      <div style="margin:0;padding:14px 16px;border:1px solid #30363d;background:#0b0e14;color:#e6edf3;">
        ${nl2br(input.body)}
      </div>
    `,
    footerHtml: `<p style="margin:10px 0 0;font-size:11px;color:#6e7681;">You're receiving this as a razaali.dev subscriber. <a href="${unsubUrl}" style="color:#6e7681;">Unsubscribe</a></p>`,
  });

  return { text, html };
}

import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth";
import { CANONICAL_HOST } from "@/lib/seo";

function canonicalHostRedirect(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost");

  if (isLocal) return null;

  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  let redirect = false;
  const url = request.nextUrl.clone();

  if (hostname.startsWith("www.")) {
    url.hostname = hostname.replace(/^www\./, "");
    redirect = true;
  } else if (
    hostname === CANONICAL_HOST ||
    hostname.endsWith(`.${CANONICAL_HOST}`)
  ) {
    // keep pages.dev / preview hosts as-is; only force apex for www
  }

  if (proto === "http") {
    url.protocol = "https:";
    redirect = true;
  }

  if (!redirect) return null;
  return NextResponse.redirect(url, 301);
}

export async function middleware(request: NextRequest) {
  const hostRedirect = canonicalHostRedirect(request);
  if (hostRedirect) return hostRedirect;

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin");

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;

  if (!session && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLogin) {
    const dash = request.nextUrl.clone();
    dash.pathname = "/admin";
    dash.search = "";
    return NextResponse.redirect(dash);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Host + HTTPS canonicalization for pages; skip static assets.
     * Admin auth still applies under /admin.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "itdos_session";

/**
 * Cheap first gate for /admin: bounce anyone without a session cookie before
 * the page renders. This is NOT the authorisation check — proxy runs ahead of
 * rendering, possibly on a CDN, and cannot read the sessions table, so it can
 * only see that *a* cookie exists. Every protected page and action calls
 * `requireUser()`, which is what actually validates it.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything under /admin except the login page itself.
  matcher: ["/admin/:path((?!login).*)", "/admin"],
};

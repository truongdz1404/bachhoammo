import { auth as middleware } from "@/auth";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default middleware((req) => {
  const session = req.auth;

  const signOutPath = "/api/auth/signout";
  if (
    session &&
    session.error === "RefreshAccessTokenError" &&
    req.nextUrl.pathname !== signOutPath
  ) {
    return NextResponse.redirect(new URL(signOutPath, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|static/).*)"],
};

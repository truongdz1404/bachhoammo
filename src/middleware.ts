import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;

  const signOutPath = "/api/auth/signout";
  if (
    session &&
    session.error === "RefreshAccessTokenError" &&
    req.nextUrl.pathname !== signOutPath
  ) {
    return NextResponse.redirect(new URL(signOutPath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|static/).*)"],
};

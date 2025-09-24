import NextAuth from "next-auth";
import Authentik from "next-auth/providers/authentik";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
  ],
});

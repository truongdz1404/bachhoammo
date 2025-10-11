import { signOut } from "@/auth";

export const GET = async () => {
  await signOut({
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_AUTH_URL,
  });
};

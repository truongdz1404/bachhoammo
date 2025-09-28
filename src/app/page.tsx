import { auth } from "@/auth";
import SignIn from "@/components/auth/signin";
import SignOut from "@/components/auth/signout";
import { apiClient } from "@/lib/api-client";

export default async function Home() {
  const session = await auth();
  if (session) {
    const req = await apiClient("samples/hello");
    const res = await req.text();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p>
          Welcome back, <strong>{session.user?.name}</strong>! {res}
        </p>
        <SignOut className="ml-2" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <SignIn />
    </div>
  );
}

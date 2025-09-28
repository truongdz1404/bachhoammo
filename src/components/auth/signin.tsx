import { signIn } from "@/auth";

interface SignInProps {
  className?: string;
}

export default function SignIn({ className }: SignInProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button
        type="submit"
        className={`px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      >
        Sign in
      </button>
    </form>
  );
}

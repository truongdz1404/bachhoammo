import { signIn } from "next-auth/react";

interface SignInProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function SignIn({ className, children }: SignInProps) {
  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <button onClick={handleSignIn} className={className}>
      {children}
    </button>
  );
}

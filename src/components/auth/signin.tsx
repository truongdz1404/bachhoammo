import { getLoginUrl } from "@/lib/auth-urls";

interface SignInProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function SignIn({ className, children }: SignInProps) {
  const handleSignIn = async () => {
    const url = await getLoginUrl();
    window.location.href = url;
  };

  return (
    <button onClick={handleSignIn} className={className}>
      {children}
    </button>
  );
}

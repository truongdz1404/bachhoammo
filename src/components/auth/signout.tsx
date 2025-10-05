import { getLogoutUrl } from "@/lib/auth-urls";

interface SignOutProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function SignOut({ className, children }: SignOutProps) {
  const handleSignOut = async () => {
    const url = await getLogoutUrl();
    window.location.href = url;
  };

  return (
    <button onClick={handleSignOut} className={className}>
      {children}
    </button>
  );
}

import { signIn } from "next-auth/react";

interface RegisterProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function Register({ className, children }: RegisterProps) {
  const handleRegister = async () => {
    // await signIn("keycloak", undefined, { prompt: "create" });
    await signIn();
  };

  return (
    <button onClick={handleRegister} className={className}>
      {children}
    </button>
  );
}

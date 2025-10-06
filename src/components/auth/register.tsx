import { signIn } from "next-auth/react";

interface RegisterProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function Register({ className, children }: RegisterProps) {
  const handleRegister = async () => {
    signIn("keycloak", {
      redirect: true,
      callbackUrl: "/",
      action: "register",
    });
  };

  return (
    <button onClick={handleRegister} className={className}>
      {children}
    </button>
  );
}

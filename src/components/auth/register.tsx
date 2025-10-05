import { getRegisterUrl } from "@/lib/auth-urls";

interface RegisterProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function Register({ className, children }: RegisterProps) {
  const handleRegister = async () => {
    const url = await getRegisterUrl();
    window.location.href = url;
  };

  return (
    <button onClick={handleRegister} className={className}>
      {children}
    </button>
  );
}

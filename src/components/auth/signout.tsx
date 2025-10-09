interface SignOutProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export async function getLogoutUrl(idToken?: string): Promise<string> {
  const urlParams = new URLSearchParams();
  urlParams.append("client_id", process.env.AUTH_KEYCLOAK_ID!);
  urlParams.append(
    "post_logout_redirect_uri",
    `${process.env.AUTH_URL}/api/auth/signout`
  );
  if (idToken) {
    urlParams.append("id_token_hint", idToken);
  }
  return `${
    process.env.AUTH_KEYCLOAK_ISSUER
  }/protocol/openid-connect/logout?${urlParams.toString()}`;
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

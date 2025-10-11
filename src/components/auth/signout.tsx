interface SignOutProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export const getLogoutUrl = (idToken?: string) => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID!);
  params.append(
    "post_logout_redirect_uri",
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`
  );
  if (idToken) {
    params.append("id_token_hint", idToken);
  }
  return `${
    process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER
  }/protocol/openid-connect/logout?${params.toString()}`;
};

export default function SignOut({ className, children }: SignOutProps) {
  return (
    <a href={getLogoutUrl()} className={className}>
      {children}
    </a>
  );
}

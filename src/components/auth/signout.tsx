interface SignOutProps {
  readonly className?: string;
}

export const generateLogoutUrl = (
  redirectUrl: string,
  idToken?: string
): string => {
  const urlParams = new URLSearchParams();
  urlParams.append("client_id", process.env.KEYCLOAK_CLIENT_ID!);
  urlParams.append(
    "post_logout_redirect_uri",
    `${redirectUrl}/api/auth/signout`
  );
  if (idToken) {
    urlParams.append("id_token_hint", idToken);
  }
  return `${
    process.env.KEYCLOAK_ISSUER
  }/protocol/openid-connect/logout?${urlParams.toString()}`;
};

export default function SignOut({ className }: SignOutProps) {
  return (
    <a
      href={generateLogoutUrl(process.env.AUTH_URL!)}
      className={`px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 ${className}`}
    >
      Sign out
    </a>
  );
}

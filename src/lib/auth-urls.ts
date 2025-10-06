"use server";

export async function getLoginUrl(): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.AUTH_KEYCLOAK_ID!,
    redirect_uri: `${process.env.AUTH_URL}/api/auth/callback/keycloak`,
    response_type: "code",
    scope: "openid profile email",
  });

  return `${
    process.env.AUTH_KEYCLOAK_ISSUER
  }/protocol/openid-connect/auth?${params.toString()}`;
}

export async function getRegisterUrl(): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.AUTH_KEYCLOAK_ID!,
    redirect_uri: `${process.env.AUTH_URL}/api/auth/callback/keycloak`,
    response_type: "code",
    scope: "openid profile email",
  });

  return `${
    process.env.AUTH_KEYCLOAK_ISSUER
  }/protocol/openid-connect/registrations?${params.toString()}`;
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

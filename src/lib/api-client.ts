import { auth } from "@/auth";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await auth();

  const config: RequestInit = {
    ...options,
    headers: {
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
      ...options.headers,
    },
  };

  return await fetch(`${process.env.API_BASE_URL}/api/v1/${endpoint}`, config);
}

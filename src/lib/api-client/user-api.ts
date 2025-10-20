import { apiClient, parseJson } from "./api-client";

export interface MeResponse {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  avatarUrl?: string;
}

export const userApi = {
  me: () =>
    apiClient("/api/v1/user/me", {
      method: "GET",
    }).then((response) => parseJson<MeResponse>(response)),

  updateProfile: (request: UpdateProfileRequest) =>
    apiClient("/api/v1/user/profile", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.ok),
};

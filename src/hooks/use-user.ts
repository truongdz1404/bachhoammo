"use client";

import {
  MeResponse,
  UpdateProfileRequest,
  userApi,
} from "@/lib/api-client/user-api";
import useSWR, { SWRConfiguration } from "swr";

export const useUser = (options?: SWRConfiguration<MeResponse>) => {
  const { data, error, isLoading, mutate } = useSWR<MeResponse>(
    "/api/v1/user/me",
    options
  );

  const editProfile = async (request: UpdateProfileRequest) => {
    const success = await userApi.updateProfile(request);
    if (success) {
      mutate();
    }
    return success;
  };

  return {
    data,
    error,
    isLoading,
    editProfile,
  };
};

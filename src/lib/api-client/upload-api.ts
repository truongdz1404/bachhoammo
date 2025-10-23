import { apiClient, parseJson } from "./api-client";

export interface SignedUrlResponse {
  url: string;
}

export const uploadApi = {
  getSignedUrl: (bucketName: string, objectName: string) =>
    apiClient(
      `/api/v1/upload/signed-url?bucketName=${encodeURIComponent(
        bucketName
      )}&objectName=${encodeURIComponent(objectName)}`,
      {
        method: "GET",
      }
    ).then((response) => parseJson<SignedUrlResponse>(response)),
};

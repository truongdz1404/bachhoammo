import { useState } from "react";
import { uploadApi } from "../lib/api-client/upload-api";

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, objectName: string) => {
    setIsUploading(true);
    setError(null);

    const bucketName = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME;
    if (!bucketName) throw new Error("Bucket name is not defined");

    const { ok, data } = await uploadApi.getSignedUrl(bucketName, objectName);
    if (!ok || !data) return;

    const response = await fetch(data.url, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      setError("Failed to upload file");
    }
    setIsUploading(false);
    return;
  };

  const getPublicUrl = (objectName: string) => {
    const bucketName = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME;
    if (!bucketName) throw new Error("Bucket name is not defined");
    return `https://storage.googleapis.com/${bucketName}/${objectName}`;
  };

  return { uploadFile, isUploading, error, getPublicUrl };
};

"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <div className="relative aspect-square">
    <button
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <Image
      src={url}
      height={500}
      width={500}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);

interface InputImageProps {
  label?: string;
  onImageChange?: (file: File | null) => void;
  className?: string;
  initialImageUrl?: string;
}

export default function InputImage({
  label = "Profile Picture",
  onImageChange,
  className,
  initialImageUrl,
}: InputImageProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>(
    initialImageUrl || null
  );

  const handleFileChange = (file: File | null) => {
    onImageChange?.(file);
  };

  return (
    <div className={`w-full max-w-40 ${className || ""}`}>
      {label && <Label htmlFor="profile">{label}</Label>}
      <div className="mt-1 w-full">
        {profilePicture ? (
          <ImagePreview
            url={profilePicture}
            onRemove={() => {
              setProfilePicture(null);
              handleFileChange(null);
            }}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setProfilePicture(imageUrl);
                handleFileChange(file);
              }
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            maxFiles={1}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-hidden focus:border-primary",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="profile" />
                <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}

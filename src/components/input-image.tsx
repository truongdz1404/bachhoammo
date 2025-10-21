"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

const ImagePreview = ({
  url,
  onRemove,
  disable,
}: {
  url: string;
  onRemove: () => void;
  disable: boolean;
}) => (
  <div className="relative aspect-square">
    <button
      className={cn("absolute top-0 right-0 translate-x-1/2 -translate-y-1/2", {
        invisible: disable,
      })}
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <Image
      src={url}
      height={500}
      width={500}
      alt=""
      className={cn(
        "border border-border h-full w-full rounded-md object-cover",
        {
          "opacity-50 cursor-not-allowed": disable,
        }
      )}
    />
  </div>
);

interface InputImageProps {
  label?: string;
  onImageChange?: (file: File | null) => void;
  className?: string;
  value?: string;
  disable?: boolean;
}

export default function InputImage({
  label = "Profile Picture",
  onImageChange,
  className,
  value,
  disable = false,
}: InputImageProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>();

  useEffect(() => {
    setProfilePicture(value);
  }, [value]);

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
              if (!disable) {
                setProfilePicture(null);
                handleFileChange(null);
              }
            }}
            disable={disable}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              if (disable) return;
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
            disabled={disable}
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
                    "opacity-50 cursor-not-allowed": disable,
                  }
                )}
                tabIndex={disable ? -1 : 0}
                aria-disabled={disable}
              >
                <input {...getInputProps()} id="profile" disabled={disable} />
                <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ProfileImageInputProps {
  value?: string;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
  allowedExtensions?: string[];
  className?: string;
}

export function ProfileImageInput({
  value,
  onChange,
  maxSizeMB = 1,
  allowedExtensions = [".JPEG", ".PNG"],
  className = "",
}: ProfileImageInputProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    const fileExtension = "." + file.name.split(".").pop()?.toUpperCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError(`Only ${allowedExtensions.join(", ")} files are allowed`);
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);

    onChange?.(file);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div
        className="size-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleSelectClick}
        title="Click to select image"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-foreground/80"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      <button
        onClick={handleSelectClick}
        className="text-sm hover:bg-muted text-foreground transition-colors border border-border px-4 py-2 rounded-md"
      >
        Select Image
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedExtensions.map((ext) => ext.toLowerCase()).join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-sm text-muted-foreground/80">
        <div>File size: maximum {maxSizeMB} MB</div>
        <div>File extension: {allowedExtensions.join(", ")}</div>
      </div>

      {error && (
        <div className="text-center text-xs text-red-500 bg-red-50 px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

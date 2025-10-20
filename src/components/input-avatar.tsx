"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  value?: string;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
  allowedExtensions?: string[];
  className?: string;
  disabled?: boolean;
}

export function InputAvatar({
  value,
  onChange,
  maxSizeMB = 1,
  allowedExtensions = [".JPEG", ".PNG"],
  className = "",
  disabled = false,
}: Props) {
  const t = useTranslations("inputAvatar");
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setPreview(value || null);
  }, [value]);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(t("fileSizeError", { maxSize: maxSizeMB }));
      return;
    }

    const fileExtension = "." + file.name.split(".").pop()?.toUpperCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError(
        t("fileExtensionError", {
          extensions: allowedExtensions.join(", "),
        })
      );
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
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center space-y-4 ${className} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div
        className="size-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleSelectClick}
        title={t("clickToSelect")}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
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
        type="button"
        onClick={handleSelectClick}
        disabled={disabled}
        className={`text-sm hover:bg-muted text-foreground transition-colors border border-border px-4 py-2 rounded-md ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        {t("selectImage")}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedExtensions.map((ext) => ext.toLowerCase()).join(",")}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      <div className="text-xs text-muted-foreground/80">
        <div>{t("fileSize", { maxSize: maxSizeMB })}</div>
        <div>
          {t("fileExtension", { extensions: allowedExtensions.join(", ") })}
        </div>
      </div>

      {error && (
        <div className="text-center text-xs text-destructive px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

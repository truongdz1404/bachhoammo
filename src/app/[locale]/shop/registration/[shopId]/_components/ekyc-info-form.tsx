"use client";

import InputImage from "@/components/input-image";
import { AdvanceInput } from "@/components/ui/advance-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface EKYCInfoFormProps {
  onDataChange?: (data: EKYCInfoData) => void;
  initialData?: EKYCInfoData & {
    frontImageUrl?: string;
    backImageUrl?: string;
    selfieImageUrl?: string;
  };
  shopId: string;
}

export interface EKYCInfoData {
  idNumber: string;
  fullName: string;
  frontImage: File | null;
  backImage: File | null;
  selfieImage: File | null;
}

export function EKYCInfoForm({ onDataChange, initialData }: EKYCInfoFormProps) {
  const t = useTranslations("shop.registration.ekyc");

  const [formData, setFormData] = useState<EKYCInfoData>(() => ({
    idNumber: initialData?.idNumber || "",
    fullName: initialData?.fullName || "",
    frontImage: initialData?.frontImage || null,
    backImage: initialData?.backImage || null,
    selfieImage: initialData?.selfieImage || null,
  }));

  const handleInputChange = (
    field: keyof EKYCInfoData,
    value: string | File | null
  ) => {
    const newData = {
      ...formData,
      [field]: value,
    };

    setFormData(newData);
    onDataChange?.(newData);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-primary border-2 bg-primary/10 [&>svg]:text-primary">
        <InfoIcon className="size-4" strokeWidth={3} />
        <AlertDescription className="text-sm text-primary">
          {t("alert")}
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-12 gap-4 items-center mt-8">
        <div className="col-span-3 flex items-start justify-end">
          <Label
            htmlFor="idNumber"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-red-500">*</span>
            {t("idNumber")}
          </Label>
        </div>
        <div className="col-span-9">
          <AdvanceInput
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              handleInputChange("idNumber", value);
            }}
            placeholder={t("idNumberPlaceholder")}
            maxLength={12}
          />
        </div>
      </div>

      {/* Full Name */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex justify-end">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-red-500">*</span>
            {t("fullName")}
          </Label>
        </div>
        <div className="col-span-9">
          <AdvanceInput
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground/60 mt-1">
            {t("fullNameNote")}
          </p>
        </div>
      </div>

      {/* Front ID Image */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-start justify-end pt-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            <span className="text-red-500">*</span>
            {t("frontImage")}
          </Label>
        </div>
        <div className="col-span-9">
          <div className="flex items-end gap-2">
            <InputImage
              label=""
              initialImageUrl={initialData?.frontImageUrl}
              onImageChange={(file: File | null) =>
                handleInputChange("frontImage", file)
              }
            />
            <Image src="/id.svg" alt="id icon" width={120} height={120} />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {t("frontImageDescription")} <br />
            {t("imageRequirement")}
          </p>
        </div>
      </div>

      {/* Back ID Image */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-start justify-end pt-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            <span className="text-red-500">*</span>
            {t("backImage")}
          </Label>
        </div>
        <div className="col-span-9">
          <div className="flex items-end gap-2">
            <InputImage
              label=""
              initialImageUrl={initialData?.backImageUrl}
              onImageChange={(file: File | null) =>
                handleInputChange("backImage", file)
              }
            />
            <Image src="/back-id.svg" alt="id icon" width={120} height={120} />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {t("backImageDescription")} <br />
            {t("imageRequirement")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-start justify-end pt-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            <span className="text-red-500">*</span>
            {t("selfieImage")}
          </Label>
        </div>
        <div className="col-span-9">
          <div className="flex items-end gap-2">
            <InputImage
              label=""
              initialImageUrl={initialData?.selfieImageUrl}
              onImageChange={(file: File | null) =>
                handleInputChange("selfieImage", file)
              }
            />
            <Image
              src="/selfie_instructions.svg"
              alt="selfie"
              width={120}
              height={120}
              className="bg-muted rounded-md"
            />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {t("selfieImageDescription")} <br />
            {t("selfieImageRequirement")}
          </p>
        </div>
      </div>
    </div>
  );
}

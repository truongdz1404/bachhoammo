"use client";

import { AdvanceInput } from "@/components/ui/advance-input";
import { AdvanceTextarea } from "@/components/ui/advance-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneVerificationInput } from "@/components/ui/phone-verification-input";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ShopInfoFormProps {
  onDataChange?: (data: ShopInfoData) => void;
}

export interface ShopInfoData {
  shopName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  description: string;
}

export function ShopInfoForm({ onDataChange }: ShopInfoFormProps) {
  const t = useTranslations("shop.registration.shopInfo");

  const [formData, setFormData] = useState<ShopInfoData>({
    shopName: "Bac_khoai_to",
    fullName: "Ngo Xuan Bac",
    phoneNumber: "0365811928",
    email: "truonglan342@gmail.com",
    description: "",
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleInputChange = (field: keyof ShopInfoData, value: string) => {
    const newData = {
      ...formData,
      [field]: value,
    };

    setFormData(newData);
    onDataChange?.(newData);
  };

  const handlePhoneVerificationSuccess = () => {
    setIsPhoneVerified(true);
  };

  const handleVerificationStatusChange = (isVerified: boolean) => {
    setIsPhoneVerified(isVerified);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="shopName"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-red-500">*</span>
            {t("shopName")}
          </Label>
        </div>
        <div className="col-span-9">
          <AdvanceInput
            id="shopName"
            value={formData.shopName}
            onChange={(e) => handleInputChange("shopName", e.target.value)}
            placeholder={t("shopNamePlaceholder")}
            className="max-w-md border border-border text-sm "
            maxLength={30}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-start justify-end pt-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium flex items-center gap-1"
          >
            {t("description")}
          </Label>
        </div>
        <div className="col-span-9">
          <AdvanceTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            className="w-full min-h-[100px] border border-border max-w-md text-sm "
            rows={4}
            maxLength={200}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="email"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-red-500">*</span>
            {t("email")}
          </Label>
        </div>
        <div className="col-span-9">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="max-w-md border border-border text-sm "
            disabled
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-red-500">*</span>
            {t("phoneNumber")}
          </Label>
        </div>
        <div className="col-span-9 max-w-md">
          <PhoneVerificationInput
            value={formData.phoneNumber}
            onChange={(value) => handleInputChange("phoneNumber", value)}
            verified={isPhoneVerified}
            onVerificationSuccess={handlePhoneVerificationSuccess}
            onVerificationStatusChange={handleVerificationStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

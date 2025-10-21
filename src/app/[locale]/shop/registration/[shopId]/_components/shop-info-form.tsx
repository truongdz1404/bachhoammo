"use client";
import { AdvanceInput } from "@/components/ui/advance-input";
import { AdvanceTextarea } from "@/components/ui/advance-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneVerificationInput } from "@/components/ui/phone-verification-input";
import { Spinner } from "@/components/ui/spinner";
import { useRegistration } from "@/hooks/use-registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import useFormBus from "../_hooks/useFormBus";

interface ShopInfoFormProps {
  shopId: string;
}

const shopInfoSchema = z.object({
  shopName: z.string().min(1, "shopNameRequired").max(30, "shopNameMaxLength"),
  phone: z
    .string()
    .min(1, "phoneRequired")
    .regex(/^[0-9]{8,15}$/, "phoneInvalid"),
  email: z.email("emailInvalid").min(1, "emailRequired"),
  description: z.string().max(200, "descriptionMaxLength").optional(),
});

export function ShopInfoForm({ shopId }: ShopInfoFormProps) {
  const t = useTranslations("shop.registration.shopInfo");
  const tex = useTranslations("exception");
  const { step1Info, data: registration, isLoading } = useRegistration(shopId);

  const { setSubmit } = useFormBus();
  const methods = useForm({
    resolver: zodResolver(shopInfoSchema),
    mode: "onBlur",
  });
  const { register, setValue, formState, reset, watch, handleSubmit } = methods;
  const [otp, setOtp] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  useEffect(() => {
    setSubmit(async () => {
      let success = false;
      const submit = handleSubmit(
        async (values) => {
          const { ok, error } = await step1Info({
            phone: values.phone,
            shopName: values.shopName,
            email: values.email,
            description: values.description,
            otp: otp || "",
          });
          success = ok;
          if (error) setError(error);
        },
        () => {
          success = false;
        }
      );
      await submit();
      return success;
    });
  }, [setSubmit, handleSubmit, step1Info, otp]);
  useEffect(() => {
    if (registration) {
      reset({
        shopName: registration.shopName,
        phone: registration.phone,
        email: registration.email,
        description: registration.description,
      });
    }
  }, [registration, reset]);

  const { errors } = formState;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="shopName"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-destructive">*</span>
            {t("shopName")}
          </Label>
        </div>
        <div className="col-span-9">
          <AdvanceInput
            id="shopName"
            value={watch("shopName") || ""}
            {...register("shopName")}
            placeholder={t("shopNamePlaceholder")}
            className="max-w-md border border-border text-sm"
            maxLength={30}
          />
          {errors.shopName && (
            <p className="text-xs text-destructive mt-1">
              {errors.shopName.message && t(errors.shopName.message)}
            </p>
          )}
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
            value={watch("description") || ""}
            id="description"
            {...register("description")}
            placeholder={t("descriptionPlaceholder")}
            className="w-full min-h-[100px] border border-border max-w-md text-sm"
            rows={4}
            maxLength={200}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1">
              {errors.description.message && t(errors.description.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="email"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-destructive">*</span>
            {t("email")}
          </Label>
        </div>
        <div className="col-span-9">
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            className="max-w-md border border-border text-sm"
            disabled
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message && t(errors.email.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-center justify-end">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-destructive">*</span>
            {t("phoneNumber")}
          </Label>
        </div>
        <div className="col-span-9 max-w-md">
          <PhoneVerificationInput
            value={watch("phone") || ""}
            onChange={(value) => setValue("phone", value)}
            onVerified={setOtp}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">
              {errors.phone.message && t(errors.phone.message)}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 flex items-center justify-end"></div>
        <div className="col-span-9 max-w-md">
          {error && (
            <div className="flex items-center gap-2 text-center text-sm text-destructive">
              <OctagonAlertIcon className="size-4" />
              {tex(error)}
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}

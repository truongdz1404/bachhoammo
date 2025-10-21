"use client";

import InputImage from "@/components/input-image";
import { AdvanceInput } from "@/components/ui/advance-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRegistration } from "@/hooks/use-registration";
import { useUpload } from "@/hooks/use-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, OctagonAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import useFormBus from "../_hooks/useFormBus";

interface EKYCInfoFormProps {
  shopId: string;
}

const ekycSchema = z.object({
  idNumber: z
    .string()
    .min(1, "required")
    .max(12, "maxLength")
    .regex(/^[0-9]+$/, "invalidIdNumber"),
  fullName: z.string().min(1, "required").max(100, "maxLength"),
  frontImageUrl: z.string().min(1, "required"),
  backImageUrl: z.string().min(1, "required"),
  selfieImageUrl: z.string().min(1, "required"),
});

type FormValues = z.infer<typeof ekycSchema>;

export function EKYCInfoForm({ shopId }: EKYCInfoFormProps) {
  const t = useTranslations("shop.registration.ekyc");
  const tva = useTranslations("validation");
  const tex = useTranslations("exception");
  const { setSubmit } = useFormBus();
  const { step2Ekyc, data: registration, isLoading } = useRegistration(shopId);

  const methods = useForm<FormValues>({
    resolver: zodResolver(ekycSchema),
    mode: "onBlur",
  });

  const { register, handleSubmit, setValue, watch, formState, reset } = methods;
  const { errors } = formState;
  const [error, setError] = useState<string | undefined>();
  const {
    uploadFile: uploadFront,
    getPublicUrl,
    isUploading: isUploadingFront,
  } = useUpload();
  const { uploadFile: uploadBack, isUploading: isUploadingBack } = useUpload();
  const { uploadFile: uploadSelfie, isUploading: isUploadingSelfie } =
    useUpload();

  const handleImageChange = async (
    file: File | null,
    field: "frontImageUrl" | "backImageUrl" | "selfieImageUrl"
  ) => {
    if (!file) return;
    try {
      const objectName = `ekyc/${shopId}/${field}-${Date.now()}`;

      if (field === "frontImageUrl") {
        await uploadFront(file, objectName);
      } else if (field === "backImageUrl") {
        await uploadBack(file, objectName);
      } else {
        await uploadSelfie(file, objectName);
      }

      const url = getPublicUrl(objectName);
      setValue(field, url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  useEffect(() => {
    setSubmit(async () => {
      let success = false;
      const submit = handleSubmit(
        async (values) => {
          const { ok, error } = await step2Ekyc({
            identificationType: 1,
            identificationNumber: values.idNumber,
            fullName: values.fullName,
            frontImageUrl: values.frontImageUrl,
            backImageUrl: values.backImageUrl,
            selfieImageUrl: values.selfieImageUrl,
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
  }, [setSubmit, handleSubmit, step2Ekyc]);

  useEffect(() => {
    if (registration) {
      reset({
        idNumber: registration.identificationNumber || "",
        fullName: registration.fullName || "",
        frontImageUrl: registration.frontImageUrl || "",
        backImageUrl: registration.backImageUrl || "",
        selfieImageUrl: registration.selfieImageUrl || "",
      });
    }
  }, [registration, reset]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {registration?.ekycStatus === "Draft" ? (
          <Alert className="border-primary border-2 bg-primary/10 [&>svg]:text-primary">
            <Spinner className="size-4 text-primary" />
            <AlertDescription className="text-sm text-primary">
              {t("processing")}
            </AlertDescription>
          </Alert>
        ) : registration?.ekycStatus === "Verified" ? (
          <Alert className="border-green-600 border-2 bg-green-100 [&>svg]:text-green-600">
            <InfoIcon className="size-4" strokeWidth={3} />
            <AlertDescription className="text-sm text-green-600">
              {t("success")}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-primary border-2 bg-primary/10 [&>svg]:text-primary">
            <InfoIcon className="size-4" strokeWidth={3} />
            <AlertDescription className="text-sm text-primary">
              {t("alert")}
            </AlertDescription>
          </Alert>
        )}
        {registration?.ekycRejectionReason && (
          <Alert className="border-destructive border-2 bg-destructive/10 [&>svg]:text-destructive">
            <OctagonAlertIcon className="size-4" strokeWidth={3} />
            <AlertDescription className="text-sm text-destructive">
              {tex(registration.ekycRejectionReason)}
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-12 gap-4 items-start mt-8">
          <div className="col-span-3 flex items-start justify-end">
            <Label
              htmlFor="idNumber"
              className="text-sm font-medium flex items-center mt-2 gap-1"
            >
              <span className="text-red-500">*</span>
              {t("idNumber")}
            </Label>
          </div>
          <div className="col-span-9">
            <AdvanceInput
              id="idNumber"
              value={watch("idNumber") || ""}
              {...register("idNumber")}
              placeholder={t("idNumberPlaceholder")}
              maxLength={12}
            />
            {errors.idNumber && (
              <p className="text-xs text-destructive mt-1">
                {tva(errors.idNumber.message as string, {
                  field: t("idNumber"),
                  max: 12,
                })}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-3 flex justify-end">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium flex items-center mt-2 gap-1"
            >
              <span className="text-red-500">*</span>
              {t("fullName")}
            </Label>
          </div>
          <div className="col-span-9">
            <AdvanceInput
              id="fullName"
              {...register("fullName")}
              value={watch("fullName") || ""}
              onChange={(e) => setValue("fullName", e.target.value)}
              placeholder={t("fullNamePlaceholder")}
              maxLength={100}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">
                {tva(errors.fullName.message as string, {
                  field: t("fullName"),
                  max: 100,
                })}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-1">
              {t("fullNameNote")}
            </p>
          </div>
        </div>

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
                value={watch("frontImageUrl") || ""}
                onImageChange={(file) => {
                  handleImageChange(file, "frontImageUrl");
                  if (!file) setValue("frontImageUrl", "");
                }}
                disable={isUploadingFront}
              />
              <Image src="/id.svg" alt="id icon" width={120} height={120} />
            </div>
            {errors.frontImageUrl && (
              <p className="text-xs text-destructive mt-1">
                {tva(errors.frontImageUrl.message as string, {
                  field: t("frontImage"),
                })}
              </p>
            )}
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
                value={watch("backImageUrl") || ""}
                onImageChange={(file) => {
                  handleImageChange(file, "backImageUrl");
                  if (!file) setValue("backImageUrl", "");
                }}
                disable={isUploadingBack}
              />
              <Image
                src="/back-id.svg"
                alt="id icon"
                width={120}
                height={120}
              />
            </div>
            {errors.backImageUrl && (
              <p className="text-xs text-destructive mt-1">
                {tva(errors.backImageUrl.message as string, {
                  field: t("backImage"),
                })}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-2">
              {t("backImageDescription")} <br />
              {t("imageRequirement")}
            </p>
          </div>
        </div>

        {/* Selfie */}
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
                value={watch("selfieImageUrl") || ""}
                onImageChange={(file) => {
                  handleImageChange(file, "selfieImageUrl");
                  if (!file) setValue("selfieImageUrl", "");
                }}
                disable={isUploadingSelfie}
              />
              <Image
                src="/selfie_instructions.svg"
                alt="selfie"
                width={120}
                height={120}
                className="bg-muted rounded-md"
              />
            </div>
            {errors.selfieImageUrl && (
              <p className="text-xs text-destructive mt-1">
                {tva(errors.selfieImageUrl.message as string, {
                  field: t("selfieImage"),
                })}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-2">
              {t("selfieImageDescription")} <br />
              {t("selfieImageRequirement")}
            </p>
          </div>
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

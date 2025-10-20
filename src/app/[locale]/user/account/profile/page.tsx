"use client";

import { InputAvatar } from "@/components/input-avatar";
import { AdvanceInput } from "@/components/ui/advance-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUpload } from "@/hooks/use-upload";
import { useUser } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProfileSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.email("Invalid email"),
  avatar: z.url("Invalid URL").optional(),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;
export default function Page() {
  const { data: user, isLoading, editProfile } = useUser();
  const t = useTranslations("user.account.profile");
  const { uploadFile, getPublicUrl, isUploading } = useUpload();
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    mode: "onBlur",
  });
  const { register, handleSubmit, watch, setValue, reset, formState } = methods;

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatarUrl,
      });
    }
  }, [user, reset]);

  const { errors } = formState;

  const handleImageChange = async (file: File | null) => {
    const objectName = `avatars/${user?.username}-${Date.now()}`;
    let url = "";
    if (file !== null) {
      await uploadFile(file!, objectName);
      url = getPublicUrl(objectName);
    }
    console.log("Public URL:", url);
    setValue("avatar", url);
  };

  const onSubmit = (data: ProfileFormData) => {
    setIsSaving(true);
    editProfile({
      fullName: data.fullName,
      avatarUrl: data.avatar,
    })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
      <div className="border-border border-b pb-4">
        <h1 className="text-lg font-medium text-foreground capitalize">
          {t("myProfile")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("manageAccount")}</p>
      </div>

      <div className="my-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="username" className="text-sm opacity-80">
                {t("username")}
              </Label>
            </div>
            <div className="col-span-9">{user?.username}</div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="fullName" className="text-sm opacity-80">
                {t("name")}
              </Label>
            </div>
            <div className="col-span-9">
              <AdvanceInput
                id="fullName"
                value={watch("fullName") || ""}
                {...register("fullName")}
                className="max-w-md border border-border text-sm"
                maxLength={50}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center justify-end">
              <Label htmlFor="email" className="text-sm opacity-80">
                {t("email")}
              </Label>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-2 max-w-md">
                <span className="text-foreground">{watch("email")}</span>
                <button className="text-blue-600 hover:underline text-sm">
                  {t("change")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:border-l">
          <InputAvatar
            value={watch("avatar") || ""}
            onChange={handleImageChange}
            maxSizeMB={1}
            allowedExtensions={[".JPEG", ".PNG"]}
            disabled={isUploading}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2"></div>
        <div className="col-span-10">
          <Button
            type="submit"
            className="p-4 rounded-md"
            disabled={isSaving || isUploading}
          >
            {isSaving && <Loader2 className="mr-1 size-4 animate-spin" />}
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}

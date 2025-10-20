"use client";
import { useTranslations } from "next-intl";
import { use } from "react";
import { EKYCInfoForm } from "../_components/ekyc-info-form";
import { ShopInfoForm } from "../_components/shop-info-form";

interface PageProps {
  params: Promise<{
    shopId: string;
    step: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const t = useTranslations("shop");
  const { shopId, step } = use(params);
  const currentStep = parseInt(step) || 1;

  return (
    <>
      {currentStep === 1 && <ShopInfoForm shopId={shopId} />}

      {currentStep === 2 && <EKYCInfoForm shopId={shopId} />}

      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            {t("registration.steps.complete")}
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Registration Complete</h3>
              <p className="text-sm text-muted-foreground">
                Your shop registration has been submitted successfully. We will
                review your information and get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

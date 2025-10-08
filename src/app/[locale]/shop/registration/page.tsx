"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { EKYCInfoForm, type EKYCInfoData } from "./_components/ekyc-info-form";
import { ProgressStepper } from "./_components/progress-stepper";
import { ShopInfoForm, type ShopInfoData } from "./_components/shop-info-form";

export default function Page() {
  const t = useTranslations("shop");
  const [currentStep, setCurrentStep] = useState(1);
  const [shopInfoData, setShopInfoData] = useState<ShopInfoData | null>(null);
  const [ekycInfoData, setEkycInfoData] = useState<EKYCInfoData | null>(null);

  const steps = useMemo(
    () => [
      { id: 1, title: t("registration.steps.shopInfo") },
      // { id: 2, title: t("registration.steps.tax") },
      { id: 2, title: t("registration.steps.identity") },
      { id: 3, title: t("registration.steps.complete") },
    ],
    [t]
  );

  const handleNext = () => {
    console.log("Shop Info Data:", shopInfoData);
    console.log("EKYC Info Data:", ekycInfoData);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-card mt-4 p-6 rounded-lg shadow-sm min-w-2xl overflow-auto">
        <div className="w-full border-b">
          <div className="max-w-5xl mx-auto ">
            <ProgressStepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <div className="py-8 max-w-4xl mx-auto">
          {currentStep === 1 && <ShopInfoForm onDataChange={setShopInfoData} />}

          {currentStep === 2 && <EKYCInfoForm onDataChange={setEkycInfoData} />}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                {t("registration.steps.complete")}
              </h2>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="rounded-md flex items-center gap-2 px-4 py-2 disabled:invisible hover:text-inherit hover:bg-border/60"
          >
            {t("registration.navigation.back")}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="rounded-md flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("registration.navigation.next")}
            </Button>
          ) : (
            <Button
              onClick={() => console.log("Submit form")}
              className="rounded-md px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm"
            >
              {t("registration.navigation.finish")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

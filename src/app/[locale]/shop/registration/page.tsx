"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ProgressStepper } from "./_components/progress-stepper";

export default function Page() {
  const t = useTranslations("shop");
  const [currentStep, setCurrentStep] = useState(1);

  const steps = useMemo(
    () => [
      { id: 1, title: t("registration.steps.shopInfo") },
      { id: 2, title: t("registration.steps.tax") },
      { id: 3, title: t("registration.steps.identity") },
      { id: 4, title: t("registration.steps.complete") },
    ],
    [t]
  );

  const handleNext = () => {
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
      <div className="bg-card border border-border mt-4 p-6 rounded-lg shadow-sm overflow-auto">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        <div className="min-h-[400px] py-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                {t("registration.steps.shopInfo")}
              </h2>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                {t("registration.steps.tax")}
              </h2>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                {t("registration.steps.identity")}
              </h2>
            </div>
          )}

          {currentStep === 4 && (
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

          {currentStep < steps.length ? (
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

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { use, useEffect, useMemo } from "react";
import { ProgressStepper } from "../_components/progress-stepper";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    shopId: string;
    step: string;
  }>;
}

export default function Layout({ children, params }: LayoutProps) {
  const t = useTranslations("shop");
  const router = useRouter();
  const { shopId, step } = use(params);
  const currentStep = parseInt(step) || 1;
  console.log({ step, currentStep });
  const steps = useMemo(
    () => [
      { id: 1, title: t("registration.steps.shopInfo") },
      { id: 2, title: t("registration.steps.identity") },
      { id: 3, title: t("registration.steps.complete") },
    ],
    [t]
  );

  // Validate step parameter
  useEffect(() => {
    if (currentStep < 1 || currentStep > steps.length) {
      router.replace(`/shop/registration/${shopId}/1`);
    }
  }, [currentStep, steps.length, shopId, router]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      router.push(`/shop/registration/${shopId}/${nextStep}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      router.push(`/shop/registration/${shopId}/${prevStep}`);
    }
  };

  const handleFinish = () => {
    console.log("Submit form");
    // TODO: Implement form submission logic
    // router.push(`/shop/registration/${shopId}/success`);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-card mt-4 p-6 rounded-lg shadow-sm min-w-2xl overflow-auto">
        <div className="w-full border-b">
          <div className="max-w-5xl mx-auto">
            <ProgressStepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <div className="py-8 max-w-4xl mx-auto">{children}</div>

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
              onClick={handleFinish}
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

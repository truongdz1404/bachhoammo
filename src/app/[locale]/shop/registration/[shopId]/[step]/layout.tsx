"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { use, useEffect, useMemo, useState } from "react";
import { ProgressStepper } from "../_components/progress-stepper";
import useFormBus from "../_hooks/useFormBus";

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
  const [isLoading, setIsLoading] = useState(false);
  const { submit } = useFormBus();
  const { shopId, step } = use(params);
  const currentStep = parseInt(step) || 1;
  const steps = useMemo(
    () => [
      { id: 1, title: t("registration.steps.shopInfo") },
      { id: 2, title: t("registration.steps.identity") },
      { id: 3, title: t("registration.steps.complete") },
    ],
    [t]
  );

  useEffect(() => {
    if (currentStep < 1 || currentStep > steps.length) {
      router.replace(`/shop/registration/${shopId}/1`);
    }
  }, [currentStep, steps.length, shopId, router]);

  const handleNext = async () => {
    setIsLoading(true);
    const success = await submit?.();
    if (success && currentStep < steps.length) {
      const nextStep = currentStep + 1;
      router.push(`/shop/registration/${shopId}/${nextStep}`);
    }
    setIsLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      router.push(`/shop/registration/${shopId}/${prevStep}`);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-card mt-4 p-6 rounded-lg shadow-sm min-w-2xl overflow-auto">
        <div className="w-full border-b">
          <div className="max-w-5xl mx-auto">
            <ProgressStepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <div className="py-8 max-w-4xl mx-auto flex flex-col gap-y-4">
          {children}
        </div>
        {currentStep < steps.length && (
          <div className="flex justify-between items-center pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="rounded-md flex items-center gap-2 px-4 py-2 disabled:invisible hover:text-inherit hover:bg-border/60"
            >
              {t("registration.navigation.back")}
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="rounded-md flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              {isLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
              {t("registration.navigation.next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

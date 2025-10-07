import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full border-b py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative flex-1"
              >
                {index < steps.length - 1 && (
                  <div className="absolute top-1 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-[0.1rem] z-0">
                    <div
                      className={cn(
                        "h-full transition-colors",
                        status === "completed" ? "bg-primary" : "bg-border"
                      )}
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "flex size-2.5 items-center justify-center rounded-full transition-colors relative z-10",
                    (status === "current" || status === "completed") &&
                      "border-primary bg-primary",
                    status === "upcoming" && "bg-border"
                  )}
                />

                <div className="mt-2 text-center">
                  <span
                    className={cn(
                      "text-sm whitespace-nowrap",
                      (status === "current" || status === "completed") &&
                        "font-medium text-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

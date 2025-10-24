import { Button } from "@/components/ui/button";
import { useRegistration } from "@/hooks/use-registration";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function SuccessPannel({ shopId }: { shopId: string }) {
  const { submit } = useRegistration(shopId);
  useEffect(() => {
    (async () => {
      const result = await submit();
      console.log(result);
    })();
  }, [submit]);
  const t = useTranslations("shop");
  return (
    <div className="flex flex-col items-center justify-center py-8 min-h-96">
      <div className="flex items-center justify-center size-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="text-green-600 size-8" strokeWidth={2} />
      </div>
      <h4 className="text-lg font-medium mb-2 text-card-foreground">
        {t("registration.success.title")}
      </h4>
      <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
        {t("registration.success.description")}
      </p>
      <Button variant="default" size="lg" className="px-6">
        {t("btn.addProduct")}
      </Button>
    </div>
  );
}

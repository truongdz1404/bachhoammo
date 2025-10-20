"use client";

import { Spinner } from "@/components/ui/spinner";
import { shopRegistrationApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const initRegistration = async () => {
      const result = await shopRegistrationApi.start();
      if (result.ok && result.data) {
        router.push(
          `/shop/registration/${result.data.shopId}/${result.data.currentStep}`
        );
      } else {
      }
    };

    initRegistration();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-6 text-primary" />
    </div>
  );
}

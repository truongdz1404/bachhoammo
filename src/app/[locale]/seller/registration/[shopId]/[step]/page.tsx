"use client";
import { use } from "react";
import { EKYCInfoForm } from "../_components/ekyc-info-form";
import { ShopInfoForm } from "../_components/shop-info-form";
import SuccessPannel from "../_components/success-pannel";

interface PageProps {
  params: Promise<{
    shopId: string;
    step: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { shopId, step } = use(params);
  const currentStep = parseInt(step) || 1;

  return (
    <>
      {currentStep === 1 && <ShopInfoForm shopId={shopId} />}
      {currentStep === 2 && <EKYCInfoForm shopId={shopId} />}
      {currentStep === 3 && <SuccessPannel shopId={shopId} />}
    </>
  );
}

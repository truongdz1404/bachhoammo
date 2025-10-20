import { useCallback } from "react";
import useSWR, { SWRConfiguration } from "swr";
import {
  CompleteStep1Request,
  CompleteStep2Request,
  RejectShopRegistrationRequest,
  shopRegistrationApi,
} from "../lib/api-client/shop-registration-api";

export interface ShopRegistrationDetail {
  shopId: number;
  shopName?: string;
  description?: string;
  email?: string;
  phone?: string;
  currentStep: number;
  status: string;
  identificationType?: number;
  identificationNumber?: string;
  fullName?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  selfieImageUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export const useRegistration = (
  shopId: string,
  options?: SWRConfiguration<ShopRegistrationDetail>
) => {
  const { data, error, isLoading, mutate } = useSWR<ShopRegistrationDetail>(
    `/api/v1/shop-registration/${shopId}`,
    options
  );

  const start = useCallback(async () => {
    const res = await shopRegistrationApi.start();
    mutate();
    return res;
  }, [mutate]);

  const step1Info = useCallback(
    async (request: CompleteStep1Request) => {
      const res = await shopRegistrationApi.step1Info(shopId, request);
      mutate();
      return res;
    },
    [mutate, shopId]
  );

  const step2Ekyc = useCallback(
    async (request: CompleteStep2Request) => {
      const res = await shopRegistrationApi.step2Ekyc(shopId, request);
      mutate();
      return res;
    },
    [mutate, shopId]
  );

  const submit = useCallback(async () => {
    const res = await shopRegistrationApi.submit(shopId);
    mutate();
    return res;
  }, [mutate, shopId]);

  const approve = useCallback(async () => {
    const res = await shopRegistrationApi.approve(shopId);
    mutate();
    return res;
  }, [mutate, shopId]);

  const reject = useCallback(
    async (request: RejectShopRegistrationRequest) => {
      const res = await shopRegistrationApi.reject(shopId, request);
      mutate();
      return res;
    },
    [mutate, shopId]
  );

  return {
    data,
    error,
    isLoading,
    start,
    step1Info,
    step2Ekyc,
    submit,
    approve,
    reject,
  };
};

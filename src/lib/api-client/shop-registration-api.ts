import { apiClient, parseJson, patchInit, postInit } from "./api-client";

export interface CompleteStep1Request {
  shopName: string;
  description?: string;
  email: string;
  phone: string;
  otp: string;
}

export interface CompleteStep2Request {
  identificationType: number;
  identificationNumber: string;
  fullName: string;
  frontImageUrl: string;
  backImageUrl?: string;
  selfieImageUrl: string;
}

export interface RejectShopRegistrationRequest {
  rejectionReason?: string;
}

export interface StartShopRegistrationResponse {
  shopId: number;
  currentStep: number;
}

export interface CompleteShopInfoResponse {
  shopId: number;
  currentStep: number;
}

export interface CompleteShopEkycStepResponse {
  shopId: number;
  currentStep: number;
}

export const shopRegistrationApi = {
  start: () =>
    apiClient("/api/v1/shop-registration/start", postInit).then((response) =>
      parseJson<StartShopRegistrationResponse>(response)
    ),

  step1Info: (shopId: string, request: CompleteStep1Request) =>
    apiClient(`/api/v1/shop-registration/${shopId}/step1-info`, {
      ...patchInit,
      body: JSON.stringify(request),
    }).then((response) => parseJson<CompleteShopInfoResponse>(response)),

  step2Ekyc: (shopId: string, request: CompleteStep2Request) =>
    apiClient(`/api/v1/shop-registration/${shopId}/step2-ekyc`, {
      ...patchInit,
      body: JSON.stringify(request),
    }).then((response) => parseJson<CompleteShopEkycStepResponse>(response)),

  submit: (shopId: string) =>
    apiClient(`/api/v1/shop-registration/${shopId}/submit`, patchInit).then(
      (response) => parseJson<null>(response)
    ),

  approve: (shopId: string) =>
    apiClient(`/api/v1/shop-registration/${shopId}/approve`, postInit).then(
      (response) => response.ok
    ),

  reject: (shopId: string, request: RejectShopRegistrationRequest) =>
    apiClient(`/api/v1/shop-registration/${shopId}/reject`, {
      ...postInit,
      body: JSON.stringify(request),
    }).then((response) => response.ok),
};

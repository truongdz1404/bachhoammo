import { apiClient, parseJson, postInit } from "./api-client";

export interface OtpRequestDto {
  phone: string;
}

export interface OtpVerifyDto {
  phone: string;
  otpCode: string;
}

export interface OtpResponseDto {
  phone: string;
  otp?: string;
  method: number;
}

export interface OtpVerificationResponseDto {
  phone: string;
  isVerified: boolean;
}

export const otpApi = {
  send: (request: OtpRequestDto) =>
    apiClient(`/api/v1/otp/send/${request.phone}`, {
      ...postInit,
    }).then((response) => parseJson<OtpResponseDto>(response)),

  verify: (request: OtpVerifyDto) =>
    apiClient("/api/v1/otp/verify", {
      ...postInit,
      body: JSON.stringify(request),
    }).then((response) => parseJson<OtpVerificationResponseDto>(response)),
};

import { apiClient, parseJson } from "./api-client";

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

export const sendOtp = async (request: OtpRequestDto) => {
  const response = await apiClient("/api/v1/otp/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseJson<OtpResponseDto>(response);
};

export const verifyOtp = async (request: OtpVerifyDto) => {
  const response = await apiClient("/api/v1/otp/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseJson<OtpVerificationResponseDto>(response);
};

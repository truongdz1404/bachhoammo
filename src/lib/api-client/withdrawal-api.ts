import { apiClient } from "@/lib/api-client/api-client";

export type CreateWithdrawalPayload = {
  amount: number;
  bankCode: string;
  accountNumber: string;
  description?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export type WithdrawalDto = {
  id: number;
  requestId: string;
  amount: number;
  description?: string | null;
  status: number;
  bankCode: string;
  accountNumber: string;
  payOSReferenceId?: string | null;
  failureReason?: string | null;
  processedAt?: string | null;
  createdAt: string;
};

export async function createWithdrawal(locale: string, payload: CreateWithdrawalPayload) {
  const res = await apiClient(`/api/v1/withdrawal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const j = await res.json();
      message = j?.message ?? message;
    } catch { }
    throw new Error(message);
  }

  return (await res.json()) as ApiResponse<WithdrawalDto>;
}

export async function getWithdrawalHistory(locale: string, shopId: number, page = 1, pageSize = 10) {
  const res = await apiClient(`/api/v1/withdrawal/shop/${shopId}?pageNumber=${page}&pageSize=${pageSize}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to retrieve withdrawal history");
  return await res.json();
}

export async function getWithdrawalById(locale: string, withdrawalId: number) {
  const res = await apiClient(`/api/v1/withdrawal/${withdrawalId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to retrieve withdrawal details");
  return await res.json();
}

export type EstimatePayoutPayload = {
  amount: number;
  toBin: string;
  toAccountNumber: string;
  category?: string[];
};

export type EstimatePayoutResponse = {
  success: boolean;
  message: string;
  fee?: number;
  total?: number;
  data?: unknown;
};

export async function estimatePayoutCost(locale: string, payload: EstimatePayoutPayload) {
  const res = await apiClient(`/api/v1/withdrawal/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Failed to estimate payout cost";
    try {
      const j = await res.json();
      message = j?.message ?? message;
    } catch { }
    throw new Error(message);
  }

  return (await res.json()) as EstimatePayoutResponse;
}

import { apiClient, Result } from "./api-client";

export interface PaymentCreateRequestDto {
    amount: number;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    returnUrl: string;
    cancelUrl: string;
    requestId: string;
}

export interface PayOSDataDto {
    bin: string;
    accountNumber: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string; // base64 or url
}

export interface PaymentResponseDto<T = unknown> {
    success: boolean;
    message: string;
    paymentUrl?: string;
    orderCode?: number;
    data?: T;
}

export const createPaymentLink = async (
    request: PaymentCreateRequestDto
): Promise<Result<PaymentResponseDto<PayOSDataDto>>> => {
    const response = await apiClient("/api/payments/create?api-version=1.0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    try {
        const data = (await response.json()) as PaymentResponseDto<PayOSDataDto>;
        if (response.ok) {
            return { success: true, data };
        }
        return { success: false, error: data?.message || response.status.toString() };
    } catch {
        return { success: false, error: response.status.toString() };
    }
};

export const getPaymentStatus = async (
    orderCode: number
): Promise<Result<PaymentResponseDto<PayOSDataDto>>> => {
    const response = await apiClient(`/api/payments/status?orderCode=${orderCode}&api-version=1.0`, {
        method: "GET",
    });
    try {
        const data = (await response.json()) as PaymentResponseDto<PayOSDataDto>;
        if (response.ok) {
            return { success: true, data };
        }
        return { success: false, error: data?.message || response.status.toString() };
    } catch {
        return { success: false, error: response.status.toString() };
    }
};

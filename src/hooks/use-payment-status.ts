"use client";

import useSWR, { SWRConfiguration } from "swr";
import { getPaymentStatus, PaymentResponseDto, PayOSDataDto } from "@/lib/api-client/payment-api";

export const usePaymentStatus = (
    orderCode: number | null,
    options?: SWRConfiguration<PaymentResponseDto<PayOSDataDto>>
) => {
    const { data, error, isLoading, mutate } = useSWR<PaymentResponseDto<PayOSDataDto>>(
        orderCode ? `/api/v1/payment/status?orderCode=${orderCode}` : null,
        async () => {
            if (!orderCode) throw new Error("No order code");
            const result = await getPaymentStatus(orderCode);
            if (!result.data) throw new Error("No data returned");
            return result.data;
        },
        {
            refreshInterval: 3000,
            revalidateOnFocus: true,
            shouldRetryOnError: true,
            dedupingInterval: 1000,
            ...options,
        }
    );

    return {
        paymentData: data?.data,
        status: data?.data?.status,
        isLoading,
        error,
        mutate,
    };
};

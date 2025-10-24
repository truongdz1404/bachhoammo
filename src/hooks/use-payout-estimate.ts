"use client";

import useSWR, { SWRConfiguration } from "swr";
import { estimatePayoutCost, EstimatePayoutResponse } from "@/lib/api-client/withdrawal-api";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 50000000;

export const usePayoutEstimate = (
    locale: string,
    amount?: number,
    toBin?: string,
    toAccountNumber?: string,
    options?: SWRConfiguration<EstimatePayoutResponse>
) => {
    const isValid =
        amount !== undefined &&
        amount >= MIN_AMOUNT &&
        amount <= MAX_AMOUNT &&
        toBin &&
        toBin.trim() !== "" &&
        toAccountNumber &&
        toAccountNumber.trim() !== "";

    const key = isValid
        ? `/api/v1/withdrawal/estimate?amount=${amount}&bin=${toBin}&account=${toAccountNumber}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<EstimatePayoutResponse>(
        key,
        async () => {
            if (!isValid || !amount || !toBin || !toAccountNumber) {
                throw new Error("Invalid parameters");
            }
            return await estimatePayoutCost(locale, {
                amount,
                toBin,
                toAccountNumber,
            });
        },
        {
            dedupingInterval: 2000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            revalidateOnReconnect: false,
            ...options,
        }
    );

    return {
        fee: data?.fee ?? 0,
        total: data?.total,
        isEstimating: isLoading,
        error,
        mutate,
    };
};

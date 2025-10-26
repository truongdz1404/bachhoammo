"use client";

import { useEffect, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { estimatePayoutCost, EstimatePayoutResponse } from "@/lib/api-client/withdrawal-api";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 50000000;
const DEBOUNCE_DELAY = 500;

export const usePayoutEstimate = (
    locale: string,
    amount?: number,
    toBin?: string,
    toAccountNumber?: string,
    options?: SWRConfiguration<EstimatePayoutResponse>
) => {
    const [debouncedParams, setDebouncedParams] = useState({
        amount,
        toBin,
        toAccountNumber,
    });
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedParams({ amount, toBin, toAccountNumber });
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [amount, toBin, toAccountNumber]);

    const isValid =
        debouncedParams.amount !== undefined &&
        debouncedParams.amount >= MIN_AMOUNT &&
        debouncedParams.amount <= MAX_AMOUNT &&
        debouncedParams.toBin &&
        debouncedParams.toBin.trim() !== "" &&
        debouncedParams.toAccountNumber &&
        debouncedParams.toAccountNumber.trim() !== "";

    const key = isValid
        ? `/api/v1/withdrawal/estimate?amount=${debouncedParams.amount}&bin=${debouncedParams.toBin}&account=${debouncedParams.toAccountNumber}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<EstimatePayoutResponse>(
        key,
        async () => {
            if (!isValid || !debouncedParams.amount || !debouncedParams.toBin || !debouncedParams.toAccountNumber) {
                throw new Error("Invalid parameters");
            }
            return await estimatePayoutCost(locale, {
                amount: debouncedParams.amount,
                toBin: debouncedParams.toBin,
                toAccountNumber: debouncedParams.toAccountNumber,
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

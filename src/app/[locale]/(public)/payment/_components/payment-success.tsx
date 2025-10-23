"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Receipt, Hourglass } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePaymentStatus } from "@/hooks/use-payment-status";

export default function PaymentSuccessPage() {
    const [message, setMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false);
    const search = useSearchParams();
    const t = useTranslations("payment.deposit.success");
    const localePrefix = useMemo(() => {
        if (typeof window === "undefined") return "";
        const seg = window.location.pathname.split("/").filter(Boolean)[0];
        return seg === "en" ? "/en" : "";
    }, []);
    const orderCodeParam = search.get("orderCode");
    const orderCodeStorage = typeof window !== "undefined" ? sessionStorage.getItem("orderCode") : null;
    const orderCodeStr = orderCodeParam || orderCodeStorage;
    const orderCode = orderCodeStr ? parseInt(orderCodeStr, 10) : null;

    const { paymentData, status, isLoading, error } = usePaymentStatus(orderCode, {
        refreshInterval: 0,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        if (!orderCode) {
            setMessage(t("orderCodeNotFound") || "Không tìm thấy mã đơn hàng để kiểm tra trạng thái.");
            setIsSuccess(false);
            return;
        }

        if (error) {
            setMessage(t("checkFailed"));
            setIsSuccess(false);
            return;
        }

        if (status) {
            const isPaid = status.toString().toUpperCase() === "PAID";
            setMessage(t(isPaid ? "successMessage" : "pendingMessage"));
            setIsSuccess(isPaid);
        }
    }, [orderCode, status, error, t]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <Badge className="bg-green-500 hover:bg-green-600">{t("paid")}</Badge>;
            case "PENDING":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">{t("pending")}</Badge>;
            case "CANCELLED":
                return <Badge className="bg-red-500 hover:bg-red-600">{t("cancelled")}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
            <div className="max-w-2xl mx-auto scale-90">
                {isLoading ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
                            <p className="text-base text-gray-600">{t("checking")}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Header Card */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardHeader className="text-center pb-3">
                                <div className="flex justify-center mb-3">
                                    {isSuccess ? (
                                        <div className={`h-16 w-16 rounded-full ${paymentData?.status === "PAID" ? " bg-green-100" : "bg-amber-300"} flex items-center justify-center`}>
                                            {paymentData?.status === "PAID" ? (
                                                <CheckCircle2 className="h-10 w-10 text-green-600" />

                                            ) : (
                                                <Hourglass className="h-10 w-10 text-amber-600" />

                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                            <XCircle className="h-10 w-10 text-red-600" />
                                        </div>
                                    )}
                                </div>
                                <CardTitle className={`text-2xl font-bold ${isSuccess ? (paymentData?.status === "PAID" ? "text-green-700" : "text-yellow-700") : "text-red-700"}`}>
                                    {isSuccess ? (paymentData?.status === "PAID" ? t("titleSuccess") : t("titlePending")) : t("titleFailed")}
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    {message}
                                </CardDescription>
                            </CardHeader>

                            {paymentData && (
                                <>
                                    <Separator />
                                    <CardContent className="pt-4">
                                        {/* Transaction Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                                                <Receipt className="h-4 w-4" />
                                                <h3 className="font-semibold text-base">{t("detailsTitle")}</h3>
                                            </div>

                                            <div className="grid gap-3">
                                                <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm font-medium">{t("orderCode")}</span>
                                                    <span className="font-semibold text-gray-900">#{paymentData.orderCode}</span>
                                                </div>

                                                <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                    <span className="text-gray-600 text-sm font-medium">{t("amount")}</span>
                                                    <span className="font-bold text-xl text-blue-700">
                                                        {paymentData.amount.toLocaleString()} VND
                                                    </span>
                                                </div>

                                                {paymentData.description && (
                                                    <div className="flex justify-between items-start p-2.5 bg-gray-50 rounded-lg">
                                                        <span className="text-gray-600 text-sm font-medium">{t("description")}</span>
                                                        <span className="text-gray-900 text-right text-sm max-w-xs">{paymentData.description}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm font-medium">{t("status")}</span>
                                                    {getStatusBadge(paymentData.status)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                                            <Button asChild className="flex-1 h-10 text-sm" size="default">
                                                <Link href={`${localePrefix}/payment/deposit`}>
                                                    <ArrowRight className="mr-2 h-4 w-4" />
                                                    {t("createNew")}
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="flex-1 h-10 text-sm" size="default">
                                                <Link href={`${localePrefix}/dashboard`}>
                                                    {t("goHome")}
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </>
                            )}
                        </Card>

                        {/* Info Alert */}
                        {!paymentData && !isLoading && (
                            <Alert>
                                <AlertDescription className="text-center text-sm">
                                    {t("noInfo")}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
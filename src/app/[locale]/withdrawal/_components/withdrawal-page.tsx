"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wallet, AlertCircle, History, Banknote } from "lucide-react";
import { useTranslations } from "next-intl";
import { createWithdrawal } from "@/lib/api-client/withdrawal-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePayoutEstimate } from "@/hooks/use-payout-estimate";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 50000000;

const POPULAR_BANKS = [
    { code: "970415", name: "Vietinbank", shortName: "VTB" },
    { code: "970436", name: "Vietcombank", shortName: "VCB" },
    { code: "970418", name: "BIDV", shortName: "BIDV" },
    { code: "970422", name: "MB Bank", shortName: "MB" },
    { code: "970407", name: "Techcombank", shortName: "TCB" },
    { code: "970432", name: "VPBank", shortName: "VPB" },
    { code: "970403", name: "Sacombank", shortName: "SCB" },
    { code: "970416", name: "ACB", shortName: "ACB" },
];

export default function WithdrawalPage({ params }: { params: { locale: string } }) {
    const router = useRouter();
    const [amount, setAmount] = useState<number>(200000);
    const [bankCode, setBankCode] = useState<string>("970418");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [accountName, setAccountName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const t = useTranslations("withdrawal");

    const suggestedAmounts = [200000, 500000, 1000000, 5000000];
    const selectedBank = POPULAR_BANKS.find(bank => bank.code === bankCode);

    const { fee: estimatedFee, isEstimating } = usePayoutEstimate(
        params.locale,
        amount,
        bankCode,
        accountNumber
    );

    const isFormValid =
        amount >= MIN_AMOUNT &&
        amount <= MAX_AMOUNT &&
        bankCode.trim() !== "" &&
        accountNumber.trim() !== "" &&
        accountName.trim() !== "";

    const handleSubmit = async () => {
        if (!isFormValid) {
            toast.error(t("error.invalidForm"));
            return;
        }

        setLoading(true);
        try {
            const res = await createWithdrawal(params.locale, {
                amount,
                bankCode,
                accountNumber,
                description: description || `Rút tiền ${amount.toLocaleString()} VND`,
            });

            if (res?.success) {
                toast.success(t("success.description"));

                // reset form
                setAmount(50000);
                setAccountNumber("");
                setAccountName("");
                setDescription("");
            } else {
                toast.error(res?.data?.description || t("error.createFailed"));
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : t("error.createFailed");
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = () => {
        const localePrefix = params.locale === "en" ? "/en" : "";
        router.push(`${localePrefix}/payment/withdrawal/history`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Wallet className="w-8 h-8 text-purple-600" />
                            {t("title")}
                        </h1>
                        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleViewHistory}
                        className="flex items-center gap-2"
                    >
                        <History className="w-4 h-4" />
                        {t("historyButton")}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    <Card className="shadow-lg border-0 lg:col-span-3">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Banknote className="w-5 h-5 text-purple-600" />
                                {t("form.title")}
                            </CardTitle>
                            <CardDescription className="text-sm">{t("form.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-base font-semibold">
                                    {t("form.amountLabel")}
                                </Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={amount.toLocaleString('vi-VN')}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\./g, '');
                                        const num = parseInt(value || "0", 10);
                                        setAmount(num);
                                    }}
                                    className="text-lg h-12"
                                    placeholder={t("form.amountPlaceholder")}
                                />
                                {(amount < MIN_AMOUNT || amount > MAX_AMOUNT) && (
                                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                                        <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <span>
                                            {t("form.amountError", { min: MIN_AMOUNT.toLocaleString(), max: MAX_AMOUNT.toLocaleString() })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {suggestedAmounts.map((suggested) => (
                                        <Button
                                            key={suggested}
                                            type="button"
                                            variant={amount === suggested ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setAmount(suggested)}
                                            className="flex-1 min-w-[80px]"
                                        >
                                            {(suggested / 1000).toLocaleString()}K
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="bankCode" className="text-base font-semibold">
                                    {t("form.bankLabel")}
                                </Label>
                                <select
                                    id="bankCode"
                                    value={bankCode}
                                    onChange={(e) => setBankCode(e.target.value)}
                                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {POPULAR_BANKS.map((bank) => (
                                        <option key={bank.code} value={bank.code}>
                                            {bank.name} ({bank.shortName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber" className="text-base font-semibold">
                                    {t("form.accountNumberLabel")}
                                </Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="h-12"
                                    placeholder={t("form.accountNumberPlaceholder")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountName" className="text-base font-semibold">
                                    {t("form.accountNameLabel")}
                                </Label>
                                <Input
                                    id="accountName"
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="h-12"
                                    placeholder={t("form.accountNamePlaceholder")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-base font-semibold">
                                    {t("form.descriptionLabel")} <span className="text-gray-400 font-normal">({t("form.optional")})</span>
                                </Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="h-12"
                                    placeholder={t("form.descriptionPlaceholder")}
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !isFormValid}
                                className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {t("form.submittingButton")}
                                    </>
                                ) : (
                                    <>
                                        <Wallet className="w-5 h-5 mr-2" />
                                        {t("form.submitButton")}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 lg:col-span-2 h-fit">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">{t("summary.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t("summary.amount")}:</span>
                                    <span className="font-semibold text-gray-900">{amount.toLocaleString()} VND</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t("summary.fee")}:</span>
                                    {isEstimating ? (
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Đang tính...
                                        </span>
                                    ) : estimatedFee > 0 ? (
                                        <span className="font-semibold text-orange-600">{estimatedFee.toLocaleString()} VND</span>
                                    ) : (
                                        <span className="font-semibold text-green-600">{t("summary.freeLabel")}</span>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">{t("summary.total")}:</span>
                                    <span className="text-xl font-bold text-purple-600">
                                        {(amount + estimatedFee).toLocaleString()} VND
                                    </span>
                                </div>
                            </div>

                            {selectedBank && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">{t("summary.bankInfo")}</p>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900">{selectedBank.name}</p>
                                        <p className="text-sm text-gray-600">{t("summary.bankCode")}: {selectedBank.code}</p>
                                    </div>
                                </div>
                            )}

                            {accountNumber && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">{t("summary.accountInfo")}</p>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">{t("summary.accountNumber")}: <span className="font-semibold text-gray-900">{accountNumber}</span></p>
                                        {accountName && (
                                            <p className="text-sm text-gray-600">{t("summary.accountName")}: <span className="font-semibold text-gray-900">{accountName}</span></p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6 shadow-lg border-0 bg-purple-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="font-semibold text-purple-900">{t("notes.title")}</p>
                                <ul className="space-y-1 ml-4 list-disc">
                                    <li>{t("notes.note1")}</li>
                                    <li>{t("notes.note2")}</li>
                                    <li>{t("notes.note3")}</li>
                                    <li>{t("notes.note4")}</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
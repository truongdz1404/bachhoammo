"use client";
import QRCode from "react-qr-code";
import { useEffect, useMemo, useState } from "react";
import { createPaymentLink, PayOSDataDto } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, QrCode, CreditCard, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePaymentStatus } from "@/hooks/use-payment-status";


const MIN_AMOUNT = 100;

function InfoRow({
  label,
  value,
  copyable,
  highlight,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("payment.deposit");
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs">{label}</span>
        <span
          className={`font-semibold ${highlight ? "text-blue-600" : "text-gray-900"
            }`}
        >
          {value}
        </span>
      </div>
      {copyable && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="text-xs px-2 py-1 h-7 border-gray-300"
        >
          {copied ? "✓" : t("depositMethod.copyButton")}
        </Button>
      )}
    </div>
  );
}

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payosData, setPayosData] = useState<PayOSDataDto | null>(null);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [createdAmount, setCreatedAmount] = useState<number | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [activeTab, setActiveTab] = useState<"qr" | "transfer">("qr");
  const t = useTranslations("payment.deposit");
  const localePrefix = useMemo(() => {
    if (typeof window === "undefined") return "";
    const seg = window.location.pathname.split("/").filter(Boolean)[0];
    return seg === "en" ? "/en" : "";
  }, []);

  const suggestedAmounts = [50000, 100000, 200000, 500000, 1000000];

  const isCreateDisabled = useMemo(() => {
    return loading || amount < MIN_AMOUNT || (payosData !== null && amount === createdAmount);
  }, [loading, amount, payosData, createdAmount]);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const returnUrl = `${origin}${localePrefix}/payment/success`;
      const cancelUrl = `${origin}${localePrefix}/payment/cancel`;

      const res = await createPaymentLink({
        amount: Math.max(1000, Math.floor(amount)),
        returnUrl,
        cancelUrl,
      });

      if (!res.ok) {
        setError(res.error || t("depositInfo.createLinkError"));
        return;
      }

      const body = res.data;
      if (!body?.success) {
        setError(body?.message || t("depositInfo.createLinkError"));
        return;
      }

      if (body.orderCode) {
        sessionStorage.setItem("paymentData", JSON.stringify({
          payosData: body.data,
          orderCode: body.orderCode,
          amount: amount,
        }));
        sessionStorage.setItem("orderCode", body.orderCode.toString());
        setOrderCode(body.orderCode);
      }
      setPayosData(body.data as PayOSDataDto);
      setCreatedAmount(amount);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Đã xảy ra lỗi";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedData = sessionStorage.getItem("paymentData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPayosData(parsed.payosData);
      setOrderCode(parsed.orderCode);
      setCreatedAmount(parsed.amount);
    }
  }, []);

  const { status } = usePaymentStatus(orderCode);

  useEffect(() => {
    if (!orderCode || !status) return;
    const successPath = `${localePrefix}/payment/success` || "/payment/success";

    if (status.toString().toUpperCase() === "PAID") {
      sessionStorage.removeItem("paymentData");
      router.push(`${successPath}?orderCode=${orderCode}`);
    }
  }, [status, orderCode, router, localePrefix]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 px-4">
      <div className="max-w-5xl scale-90 mx-auto">
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-4 h-4 text-blue-600" />
                {t("depositInfo.title")}
              </CardTitle>
              <CardDescription className="text-xs">{t("depositInfo.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-semibold">{t("depositInfo.amountLabel")}</Label>
                <Input
                  id="amount"
                  type="text"
                  min={MIN_AMOUNT}
                  value={amount.toLocaleString('vi-VN')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\./g, '');
                    const num = parseInt(value || "0", 10);
                    setAmount(num);
                  }}
                  className="text-lg h-12"
                  placeholder={t("depositInfo.amountPlaceholder")}
                />
                {amount < MIN_AMOUNT && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {t("depositInfo.amountError")}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestedAmounts.map((suggested) => (
                    <Button
                      key={suggested}
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

              <div className="bg-blue-50 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{t("depositInfo.amountLabel")}:</span>
                  <span className="font-semibold text-gray-900">{amount.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{t("depositInfo.feeLabel")}:</span>
                  <span className="font-semibold text-green-600">{t("depositInfo.feeValue")}</span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{t("depositInfo.totalLabel")}:</span>
                  <span className="text-lg font-bold text-blue-600">{amount.toLocaleString()} VND</span>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={isCreateDisabled}
                className="w-full h-10 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("depositInfo.loadingButton")}
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    {t("depositInfo.proceedButton")}
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* QR Code Display */}
          {payosData ? (
            <Card className="shadow-md border-0">
              <CardHeader className="text-center pb-0">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {t("depositMethod.title")}
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  {t("depositMethod.description")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab("qr")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "qr"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <QrCode className="w-4 h-4" />
                    {t("depositMethod.qrOption")}
                  </button>
                  <button
                    onClick={() => setActiveTab("transfer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "transfer"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t("depositMethod.transferOption")}
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "qr" ? (
                  <div className="flex justify-center p-6 bg-white rounded-xl border border-gray-200">
                    <QRCode value={payosData.qrCode} size={215} />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 border border-gray-200">
                    <InfoRow
                      label={t("depositMethod.accountName")}
                      value={"Vũ Quang Trường"}
                      copyable
                    />
                    <InfoRow
                      label={t("depositMethod.bankName")}
                      value={payosData.bin || "—"}
                    />
                    <InfoRow
                      label={t("depositMethod.accountNumber")}
                      value={payosData.accountNumber}
                      copyable
                    />
                    <InfoRow
                      label={t("depositMethod.amount")}
                      value={`${payosData.amount.toLocaleString()} VND`}
                      copyable
                      highlight
                    />
                    <InfoRow
                      label={t("depositMethod.transferContent")}
                      value={payosData.description}
                      copyable
                    />
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {t("depositMethod.note1")}{" "}
                    <span className="font-semibold">
                      {payosData.amount.toLocaleString()}
                    </span>{" "}
                    {t("depositMethod.note2")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("depositMethod.qrNotFound")}</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  {t("depositMethod.qrNote")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-6 shadow-lg border-0 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold text-blue-900">{t("note.important")}</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>{t("note.note1")}</li>
                  <li>{t("note.note2")}</li>
                  <li>{t("note.note3")}</li>
                  <li>{t("note.note4")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
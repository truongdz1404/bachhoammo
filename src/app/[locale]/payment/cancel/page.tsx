"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4 text-red-700">Đã huỷ thanh toán</h1>
        <p className="text-gray-700 mb-4">Giao dịch của bạn đã bị huỷ hoặc không hoàn tất.</p>
        <Link href="/payment/deposit" className="px-4 py-2 rounded bg-blue-600 text-white">
          Quay lại nạp tiền
        </Link>
      </div>
    </div>
  );
}

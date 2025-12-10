"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CancelPaymentParams {
  transactionKey: string;
}

interface CancelPaymentResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export function usePaymentCancel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelPayment = async (params: CancelPaymentParams) => {
    try {
      setIsLoading(true);
      setError(null);

      // API 요청
      const response = await fetch("/api/payments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionKey: params.transactionKey,
        }),
      });

      const data: CancelPaymentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "구독 취소에 실패했습니다.");
      }

      // 성공 시 알림 메시지 표시
      alert("구독이 취소되었습니다.");

      // 매거진 페이지로 이동
      router.push("/magazines");

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "구독 취소 중 오류가 발생했습니다.";
      setError(errorMessage);
      alert(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelPayment,
    isLoading,
    error,
  };
}

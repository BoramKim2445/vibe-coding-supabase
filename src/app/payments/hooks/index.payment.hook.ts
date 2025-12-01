import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * PortOne v2를 사용한 빌링키 발급 및 구독 결제 훅
 *
 * 흐름:
 * 1. 빌링키 발급 (PortOne SDK 사용)
 * 2. 빌링키로 결제 API 호출
 * 3. 성공 시 알림 및 페이지 이동
 */
export function usePaymentSubscription() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 구독하기 메인 함수
   * - 빌링키 발급 후 자동으로 결제 진행
   */
  const handleSubscribe = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 빌링키 발급 요청
      const billingKeyResult = await requestBillingKey();

      if (!billingKeyResult.success) {
        console.error("빌링키 발급 실패:", billingKeyResult.error);
        alert(`빌링키 발급에 실패했습니다.\n${billingKeyResult.error || "다시 시도해주세요."}`);
        setIsProcessing(false);
        return;
      }

      // billingKey와 customerId가 없으면 리턴 (타입 가드)
      if (!billingKeyResult.billingKey || !billingKeyResult.customerId) {
        alert("빌링키 정보를 가져오는데 실패했습니다.");
        setIsProcessing(false);
        return;
      }

      const { billingKey, customerId } = billingKeyResult;

      // 2. 발급받은 빌링키로 결제 API 호출
      const paymentResult = await processPayment({
        billingKey,
        orderName: "IT 매거진 월간 구독",
        amount: 9900,
        customer: {
          id: customerId,
        },
      });

      if (!paymentResult.success) {
        console.error("결제 실패:", paymentResult.error);
        alert(`결제에 실패했습니다.\n${paymentResult.error || "다시 시도해주세요."}`);
        setIsProcessing(false);
        return;
      }

      // 3. 결제 성공 처리
      alert("구독에 성공하였습니다.");
      router.push("/magazines");
    } catch (error) {
      console.error("구독 처리 중 오류:", error);
      alert("구독 처리 중 오류가 발생했습니다.\n다시 시도해주세요.");
      setIsProcessing(false);
    }
  };

  return {
    handleSubscribe,
    isProcessing,
  };
}

/**
 * PortOne v2 SDK를 사용하여 빌링키 발급
 * 토스페이먼츠 PG 사용
 */
async function requestBillingKey(): Promise<{
  success: boolean;
  billingKey?: string;
  customerId?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    try {
      // PortOne SDK 존재 확인
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window === "undefined" || !(window as any).PortOne) {
        resolve({
          success: false,
          error: "PortOne SDK가 로드되지 않았습니다.",
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PortOne = (window as any).PortOne;

      // 고유한 발급 ID 생성
      const issueId = `issue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 환경변수에서 스토어ID와 채널키를 가져옴
      // 실제 환경에서는 .env.local에 다음 값들을 설정해야 함:
      // NEXT_PUBLIC_PORTONE_STORE_ID=your-store-id
      // NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your-channel-key
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-test";
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-test";

      console.log("빌링키 발급 요청:", {
        storeId,
        issueId,
        customerId,
      });

      // PortOne v2 빌링키 발급 요청
      PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: "CARD",
        issueId,
        issueName: "IT 매거진 월간 구독",
        customer: {
          customerId,
        },
        customData: {
          orderName: "IT 매거진 월간 구독",
          amount: 9900,
        },
      })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          console.log("빌링키 발급 응답:", response);

          // 성공 케이스
          if (response && response.code === undefined) {
            resolve({
              success: true,
              billingKey: response.billingKey,
              customerId,
            });
          } else {
            // 실패 케이스
            resolve({
              success: false,
              error: response.message || "빌링키 발급에 실패했습니다.",
            });
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          console.error("빌링키 발급 오류:", error);
          resolve({
            success: false,
            error: error.message || "빌링키 발급 중 오류가 발생했습니다.",
          });
        });
    } catch (error) {
      console.error("빌링키 발급 예외:", error);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    }
  });
}

/**
 * 결제 API 호출
 */
async function processPayment(data: {
  billingKey: string;
  orderName: string;
  amount: number;
  customer: {
    id: string;
  };
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log("결제 API 요청:", data);

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log("결제 API 응답:", result);

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || "결제 요청이 실패했습니다.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("결제 API 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.",
    };
  }
}

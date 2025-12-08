import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

// 포트원 API 기본 설정
const PORTONE_API_BASE_URL = "https://api.portone.io";
const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET || "";

// 포트원 결제 정보 타입
interface PortOnePaymentInfo {
  id: string;
  billingKey?: string;
  orderName: string;
  amount: {
    total: number;
  };
  customer: {
    id: string;
  };
}

// 요청 데이터 타입
interface WebhookRequest {
  payment_id: string;
  status: "Paid" | "Cancelled";
}

/**
 * 포트원 API에서 결제 정보 조회
 */
async function fetchPaymentInfo(paymentId: string): Promise<PortOnePaymentInfo> {
  const response = await fetch(`${PORTONE_API_BASE_URL}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `PortOne ${PORTONE_API_SECRET}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`포트원 결제 정보 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 한국 시간 기준으로 날짜 계산 후 UTC로 변환
 */
function calculateDates(baseDate: Date = new Date()) {
  // 현재 시각 (UTC)
  const startAt = baseDate;

  // 30일 후 (end_at)
  const endAt = new Date(startAt);
  endAt.setDate(endAt.getDate() + 30);

  // end_at + 1일 밤 11:59:59 (한국시간 기준)
  // 한국은 UTC+9이므로, 한국시간 23:59:59는 UTC 14:59:59
  const endGraceAt = new Date(endAt);
  endGraceAt.setDate(endGraceAt.getDate() + 1);
  endGraceAt.setUTCHours(14, 59, 59, 999); // UTC 14:59:59 = KST 23:59:59

  // end_at + 1일 오전 10시~11시 사이 임의 시각 (한국시간 기준)
  // 한국시간 10:00~11:00은 UTC 01:00~02:00
  const nextScheduleAt = new Date(endAt);
  nextScheduleAt.setDate(nextScheduleAt.getDate() + 1);
  const randomMinutes = Math.floor(Math.random() * 60); // 0~59분 사이 랜덤
  nextScheduleAt.setUTCHours(1, randomMinutes, 0, 0); // UTC 01:00~01:59 = KST 10:00~10:59

  return {
    startAt,
    endAt,
    endGraceAt,
    nextScheduleAt,
  };
}

/**
 * Supabase payment 테이블에 결제 정보 저장
 */
async function savePaymentToSupabase(paymentInfo: PortOnePaymentInfo, dates: ReturnType<typeof calculateDates>, nextScheduleId: string) {
  const { data, error } = await supabase.from("payment").insert({
    transaction_key: paymentInfo.id,
    amount: paymentInfo.amount.total,
    status: "Paid",
    start_at: dates.startAt.toISOString(),
    end_at: dates.endAt.toISOString(),
    end_grace_at: dates.endGraceAt.toISOString(),
    next_schedule_at: dates.nextScheduleAt.toISOString(),
    next_schedule_id: nextScheduleId,
  });

  if (error) {
    throw new Error(`Supabase 저장 실패: ${error.message}`);
  }

  return data;
}

/**
 * 포트원에 다음 구독 결제 예약
 */
async function scheduleNextPayment(nextScheduleId: string, paymentInfo: PortOnePaymentInfo, nextScheduleAt: Date) {
  const response = await fetch(`${PORTONE_API_BASE_URL}/payments/${nextScheduleId}/schedule`, {
    method: "POST",
    headers: {
      Authorization: `PortOne ${PORTONE_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment: {
        billingKey: paymentInfo.billingKey,
        orderName: paymentInfo.orderName,
        customer: {
          id: paymentInfo.customer.id,
        },
        amount: {
          total: paymentInfo.amount.total,
        },
        currency: "KRW",
      },
      timeToPay: nextScheduleAt.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`포트원 구독 예약 실패: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * POST /api/portone
 * 포트원 구독 결제 웹훅 처리
 */
export async function POST(request: NextRequest) {
  try {
    const body: WebhookRequest = await request.json();
    const { payment_id, status } = body;

    // 체크리스트 초기화
    const checklist: string[] = [];

    // 1. 요청 데이터 검증
    if (!payment_id || !status) {
      return NextResponse.json({ success: false, error: "필수 파라미터 누락" }, { status: 400 });
    }
    checklist.push("✓ 요청 데이터 검증 완료");

    // 2. Paid 상태 처리
    if (status === "Paid") {
      // 2-1. 포트원에서 결제 정보 조회
      const paymentInfo = await fetchPaymentInfo(payment_id);
      checklist.push(`✓ 포트원 결제 정보 조회 완료 (결제ID: ${paymentInfo.id})`);

      // 2-2. 날짜 계산
      const dates = calculateDates();
      checklist.push(`✓ 날짜 계산 완료 (구독 시작: ${dates.startAt.toISOString()}, 종료: ${dates.endAt.toISOString()})`);

      // 2-3. 다음 스케줄 ID 생성
      const nextScheduleId = randomUUID();
      checklist.push(`✓ 다음 스케줄 ID 생성 완료 (${nextScheduleId})`);

      // 2-4. Supabase에 결제 정보 저장
      await savePaymentToSupabase(paymentInfo, dates, nextScheduleId);
      checklist.push(`✓ Supabase payment 테이블 저장 완료 (금액: ${paymentInfo.amount.total}원)`);

      // 2-5. 포트원에 다음 구독 예약
      await scheduleNextPayment(nextScheduleId, paymentInfo, dates.nextScheduleAt);
      checklist.push(`✓ 포트원 다음 구독 예약 완료 (예약시각: ${dates.nextScheduleAt.toISOString()})`);

      return NextResponse.json({
        success: true,
        message: "구독 결제 처리 완료",
        checklist,
      });
    }

    // 3. Cancelled 상태 처리 (필요시 추가 구현)
    if (status === "Cancelled") {
      checklist.push("✓ Cancelled 상태 확인 (추가 처리 없음)");

      return NextResponse.json({
        success: true,
        message: "결제 취소 확인",
        checklist,
      });
    }

    return NextResponse.json({ success: false, error: "알 수 없는 상태" }, { status: 400 });
  } catch (error) {
    console.error("포트원 웹훅 처리 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "서버 오류",
      },
      { status: 500 }
    );
  }
}

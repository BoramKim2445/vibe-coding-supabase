import { NextRequest, NextResponse } from "next/server";

/**
 * PortOne v2 결제 취소 API 라우트 핸들러
 * POST /api/payments/cancel
 *
 * 요청 데이터:
 * - transactionKey: string (취소할 결제의 트랜잭션 키)
 *
 * 응답 데이터:
 * - success: boolean (취소 성공 여부)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱
    const body = await request.json();
    const { transactionKey } = body;

    // 2. 필수 필드 검증
    if (!transactionKey) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 필드가 누락되었습니다.",
          details: {
            transactionKey: !transactionKey ? "필수" : "확인",
          },
        },
        { status: 400 }
      );
    }

    // 3. PortOne API 키 확인
    const portoneApiSecret = process.env.PORTONE_API_SECRET;
    if (!portoneApiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "PortOne API 키가 설정되지 않았습니다. PORTONE_API_SECRET 환경 변수를 확인해주세요.",
        },
        { status: 500 }
      );
    }

    // 4. PortOne v2 API 결제 취소 요청
    const portoneEndpoint = `https://api.portone.io/payments/${transactionKey}/cancel`;

    const portoneRequestBody = {
      reason: "취소 사유 없음",
    };

    console.log("PortOne 결제 취소 요청:", {
      endpoint: portoneEndpoint,
      transactionKey,
      reason: portoneRequestBody.reason,
    });

    const portoneResponse = await fetch(portoneEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `PortOne ${portoneApiSecret}`,
      },
      body: JSON.stringify(portoneRequestBody),
    });

    const portoneData = await portoneResponse.json();

    // 5. PortOne 응답 처리
    if (!portoneResponse.ok) {
      console.error("PortOne 결제 취소 실패:", portoneData);
      return NextResponse.json(
        {
          success: false,
          error: "PortOne 결제 취소 요청이 실패했습니다.",
          details: portoneData,
        },
        { status: portoneResponse.status }
      );
    }

    // 6. 성공 응답 반환 (DB에 저장하지 않음)
    console.log("PortOne 결제 취소 성공:", {
      transactionKey,
      cancelledAt: portoneData.cancelledAt,
      status: portoneData.status,
    });

    return NextResponse.json({
      success: true,
      data: portoneData,
    });
  } catch (error) {
    console.error("결제 취소 처리 중 오류 발생:", error);

    return NextResponse.json(
      {
        success: false,
        error: "결제 취소 처리 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}

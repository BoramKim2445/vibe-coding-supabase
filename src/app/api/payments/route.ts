import { NextRequest, NextResponse } from 'next/server';

/**
 * PortOne v2 결제 API 라우트 핸들러
 * POST /api/payments
 * 
 * 요청 데이터:
 * - billingKey: string (빌링키)
 * - orderName: string (주문명)
 * - amount: number (결제 금액)
 * - customer.id: string (고객 ID)
 * 
 * 응답 데이터:
 * - success: boolean (결제 성공 여부)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱
    const body = await request.json();
    const { billingKey, orderName, amount, customer } = body;

    // 2. 필수 필드 검증
    if (!billingKey || !orderName || !amount || !customer?.id) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 필드가 누락되었습니다.',
          details: {
            billingKey: !billingKey ? '필수' : '확인',
            orderName: !orderName ? '필수' : '확인',
            amount: !amount ? '필수' : '확인',
            customerId: !customer?.id ? '필수' : '확인',
          }
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
          error: 'PortOne API 키가 설정되지 않았습니다. PORTONE_API_SECRET 환경 변수를 확인해주세요.'
        },
        { status: 500 }
      );
    }

    // 4. 고유한 paymentId 생성 (타임스탬프 + 랜덤)
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 5. PortOne v2 API 결제 요청
    const portoneEndpoint = `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`;
    
    const portoneRequestBody = {
      billingKey,
      orderName,
      amount: {
        total: amount
      },
      customer: {
        id: customer.id
      },
      currency: "KRW"
    };

    console.log('PortOne 결제 요청:', {
      endpoint: portoneEndpoint,
      paymentId,
      orderName,
      amount,
      customerId: customer.id
    });

    const portoneResponse = await fetch(portoneEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `PortOne ${portoneApiSecret}`
      },
      body: JSON.stringify(portoneRequestBody)
    });

    const portoneData = await portoneResponse.json();

    // 6. PortOne 응답 처리
    if (!portoneResponse.ok) {
      console.error('PortOne 결제 실패:', portoneData);
      return NextResponse.json(
        {
          success: false,
          error: 'PortOne 결제 요청이 실패했습니다.',
          details: portoneData
        },
        { status: portoneResponse.status }
      );
    }

    // 7. 성공 응답 반환 (DB에 저장하지 않음)
    console.log('PortOne 결제 성공:', {
      paymentId,
      status: portoneData.status
    });

    return NextResponse.json({
      success: true,
      paymentId,
      data: portoneData
    });

  } catch (error) {
    console.error('결제 처리 중 오류 발생:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '결제 처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}


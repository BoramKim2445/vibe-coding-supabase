# 포트원 구독 결제 웹훅 API 구현 체크리스트

## 📋 구현 완료 항목

### ✅ 1. API 엔드포인트 설정

- **경로**: `src/app/api/portone/route.ts`
- **메서드**: POST
- **요청 데이터**:
  ```typescript
  {
    payment_id: string;
    status: "Paid" | "Cancelled";
  }
  ```
- **응답 데이터**:
  ```typescript
  {
    success: boolean
    message?: string
    checklist?: string[]
    error?: string
  }
  ```

### ✅ 2. 포트원 결제 정보 조회 구현

- **함수**: `fetchPaymentInfo(paymentId: string)`
- **API 엔드포인트**: `https://api.portone.io/payments/{payment_id}`
- **메서드**: GET
- **인증**: `Authorization: PortOne ${PORTONE_API_SECRET}`
- **반환 데이터**:
  - `id`: 결제 ID
  - `billingKey`: 빌링키
  - `orderName`: 주문명
  - `amount.total`: 결제 금액
  - `customer.id`: 고객 ID

### ✅ 3. Supabase payment 테이블 저장 로직

- **함수**: `savePaymentToSupabase()`
- **저장 필드**:
  - `transaction_key`: 결제 ID (paymentId)
  - `amount`: 결제 금액
  - `status`: "Paid"
  - `start_at`: 현재 시각 (UTC)
  - `end_at`: 현재 시각 + 30일 (UTC)
  - `end_grace_at`: end_at + 1일 밤 11:59:59 KST → UTC 14:59:59
  - `next_schedule_at`: end_at + 1일 오전 10시~11시 KST → UTC 01:00~01:59 (랜덤)
  - `next_schedule_id`: UUID v4

### ✅ 4. 포트원 다음 구독 예약 구현

- **함수**: `scheduleNextPayment()`
- **API 엔드포인트**: `https://api.portone.io/payments/${next_schedule_id}/schedule`
- **메서드**: POST
- **요청 바디**:
  ```json
  {
    "payment": {
      "billingKey": "결제정보.billingKey",
      "orderName": "결제정보.orderName",
      "customer": {
        "id": "결제정보.customer.id"
      },
      "amount": {
        "total": "결제정보.amount.total"
      },
      "currency": "KRW"
    },
    "timeToPay": "next_schedule_at (ISO 8601)"
  }
  ```

### ✅ 5. 날짜/시간 계산 및 UTC 변환

- **함수**: `calculateDates()`
- **로직**:
  1. `startAt`: 현재 시각 (UTC)
  2. `endAt`: startAt + 30일
  3. `endGraceAt`: endAt + 1일 23:59:59 KST
     - KST = UTC+9이므로, UTC 14:59:59로 저장
  4. `nextScheduleAt`: endAt + 1일 10:00~10:59 KST (랜덤)
     - KST 10:00~10:59 = UTC 01:00~01:59
     - 랜덤 분(0~59) 적용

### ✅ 6. 에러 처리

- 필수 파라미터 검증
- 포트원 API 호출 실패 처리
- Supabase 저장 실패 처리
- 전체 에러 catch 및 로깅

### ✅ 7. 체크리스트 반환

API 응답에 실행 단계별 체크리스트 포함:

- ✓ 요청 데이터 검증 완료
- ✓ 포트원 결제 정보 조회 완료 (결제ID)
- ✓ 날짜 계산 완료 (구독 시작/종료)
- ✓ 다음 스케줄 ID 생성 완료
- ✓ Supabase payment 테이블 저장 완료 (금액)
- ✓ 포트원 다음 구독 예약 완료 (예약시각)

---

## 🔧 환경 변수 설정 필요

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 포트원 설정
PORTONE_API_SECRET=your_portone_api_secret
```

---

## 📊 Supabase 테이블 스키마

`payment` 테이블이 다음 구조를 가져야 합니다:

```sql
CREATE TABLE payment (
  id BIGSERIAL PRIMARY KEY,
  transaction_key TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  end_grace_at TIMESTAMPTZ NOT NULL,
  next_schedule_at TIMESTAMPTZ NOT NULL,
  next_schedule_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🧪 테스트 예시

### 요청 예시

```bash
curl -X POST http://localhost:3000/api/portone \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "imp_123456789",
    "status": "Paid"
  }'
```

### 성공 응답 예시

```json
{
  "success": true,
  "message": "구독 결제 처리 완료",
  "checklist": [
    "✓ 요청 데이터 검증 완료",
    "✓ 포트원 결제 정보 조회 완료 (결제ID: imp_123456789)",
    "✓ 날짜 계산 완료 (구독 시작: 2025-12-08T..., 종료: 2026-01-07T...)",
    "✓ 다음 스케줄 ID 생성 완료 (uuid)",
    "✓ Supabase payment 테이블 저장 완료 (금액: 9900원)",
    "✓ 포트원 다음 구독 예약 완료 (예약시각: 2026-01-08T01:30:00Z)"
  ]
}
```

---

## ✨ 구현 완료!

모든 요구사항이 step-by-step으로 구현되었으며, 각 단계마다 체크리스트가 반환됩니다.



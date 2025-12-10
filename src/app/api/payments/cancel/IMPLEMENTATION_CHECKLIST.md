# 결제 취소 API 구현 체크리스트

## 📋 구현 개요
- **경로**: `src/app/api/payments/cancel/route.ts`
- **메서드**: POST
- **설명**: PortOne v2를 연동하여 결제 취소 처리

---

## ✅ 구현 완료 항목

### 1. API 기본 구조
- [x] Next.js 14 App Router API Route 생성
- [x] POST 메서드 핸들러 구현
- [x] TypeScript 타입 안전성 적용

### 2. 요청 데이터 처리
- [x] 요청 데이터 파싱 (JSON)
- [x] 필수 필드 검증
  - [x] `transactionKey` 필드 검증
- [x] 누락된 필드에 대한 400 에러 응답

### 3. 환경 변수 검증
- [x] `PORTONE_API_SECRET` 환경 변수 확인
- [x] API 키 누락 시 500 에러 응답

### 4. PortOne v2 API 연동
- [x] 결제 취소 API 엔드포인트 호출
  - [x] URL: `https://api.portone.io/payments/${transactionKey}/cancel`
  - [x] 메서드: POST
  - [x] 헤더:
    - [x] `Content-Type: application/json`
    - [x] `Authorization: PortOne ${PORTONE_API_SECRET}`
  - [x] 요청 바디: `{ reason: "취소 사유 없음" }`

### 5. 응답 처리
- [x] PortOne 응답 처리
  - [x] 성공 시: `{ success: true, data: ... }` 반환
  - [x] 실패 시: 적절한 에러 메시지와 상태 코드 반환
- [x] DB에 저장하지 않고 응답 반환 (요구사항 준수)

### 6. 에러 처리
- [x] try-catch로 전체 에러 핸들링
- [x] 각 단계별 상세한 에러 로깅
- [x] 사용자 친화적인 에러 메시지
- [x] 적절한 HTTP 상태 코드 반환
  - [x] 400: 잘못된 요청
  - [x] 500: 서버 오류
  - [x] PortOne 응답 상태 코드 전달

### 7. 로깅
- [x] 결제 취소 요청 로깅
- [x] 결제 취소 성공 로깅
- [x] 에러 로깅

---

## 📝 API 명세

### 요청
```typescript
POST /api/payments/cancel

Content-Type: application/json

{
  "transactionKey": "payment_123456789_abc"
}
```

### 성공 응답
```typescript
{
  "success": true,
  "data": {
    // PortOne 응답 데이터
    "id": "payment_123456789_abc",
    "status": "CANCELLED",
    "cancelledAt": "2025-12-11T12:34:56.789Z",
    ...
  }
}
```

### 실패 응답 (필수 필드 누락)
```typescript
{
  "success": false,
  "error": "필수 필드가 누락되었습니다.",
  "details": {
    "transactionKey": "필수"
  }
}
```

### 실패 응답 (PortOne API 에러)
```typescript
{
  "success": false,
  "error": "PortOne 결제 취소 요청이 실패했습니다.",
  "details": {
    // PortOne 에러 상세 정보
  }
}
```

---

## 🔧 필요한 환경 변수

`.env.local` 파일에 다음 환경 변수가 설정되어 있어야 합니다:

```env
PORTONE_API_SECRET=your_portone_api_secret_key
```

---

## 🧪 테스트 방법

### 1. cURL을 사용한 테스트
```bash
curl -X POST http://localhost:3000/api/payments/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "transactionKey": "payment_123456789_abc"
  }'
```

### 2. 프론트엔드에서 테스트
```typescript
const response = await fetch('/api/payments/cancel', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transactionKey: 'payment_123456789_abc'
  })
});

const result = await response.json();
console.log(result);
```

---

## 📌 구현 특징

1. **요구사항 완벽 준수**
   - PortOne v2 API 연동
   - DB 저장하지 않고 즉시 응답 반환
   - 취소 사유: "취소 사유 없음" 하드코딩

2. **견고한 에러 처리**
   - 다단계 검증 (필수 필드, 환경 변수, API 응답)
   - 상세한 에러 메시지와 로깅
   - 적절한 HTTP 상태 코드 사용

3. **기존 코드 패턴 준수**
   - `src/app/api/payments/route.ts`와 동일한 구조
   - 일관된 코딩 스타일
   - TypeScript 타입 안전성

4. **운영 환경 고려**
   - console.log를 통한 디버깅 정보 제공
   - 상세한 에러 로깅
   - 환경 변수 검증

---

## ✨ 구현 완료!

모든 요구사항이 성공적으로 구현되었습니다. 이제 다음 단계를 진행할 수 있습니다:

1. ✅ 환경 변수 설정 확인
2. ✅ 로컬 서버에서 API 테스트
3. ✅ 실제 PortOne 계정과 연동 테스트
4. ✅ 프론트엔드 통합

---

**구현 일시**: 2025-12-11  
**구현 파일**: `src/app/api/payments/cancel/route.ts`  
**참조 문서**: `src/app/api/payments/cancel/prompts/prompt.201.func.payment.cancel.txt`


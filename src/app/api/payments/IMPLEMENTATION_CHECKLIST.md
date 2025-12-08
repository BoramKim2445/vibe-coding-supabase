==============================================
PortOne v2 결제 API 구현 체크리스트
구현 파일: src/app/api/payments/route.ts
==============================================

✅ 완료된 구현 항목
==============================================

1. ✅ API 라우트 설정
   - 경로: src/app/api/payments/route.ts
   - 메서드: POST
   - Next.js 14 App Router Route Handler 사용

2. ✅ 요청 데이터 처리
   - billingKey: string (빌링키)
   - orderName: string (주문명)
   - amount: number (결제 금액)
   - customer.id: string (고객 ID)

3. ✅ 응답 데이터 구조
   - success: boolean (결제 성공 여부)
   - paymentId: string (생성된 결제 ID)
   - data: object (PortOne 응답 데이터)

4. ✅ 필수 필드 검증
   - billingKey, orderName, amount, customer.id 검증
   - 누락된 필드에 대한 상세 에러 메시지 제공

5. ✅ PortOne v2 API 연동
   - API 엔드포인트: https://api.portone.io/payments/${paymentId}/billing-key
   - HTTP 메서드: POST
   - Authorization 헤더: PortOne ${PORTONE_API_SECRET}

6. ✅ PortOne 요청 바디 구조
   - billingKey
   - orderName
   - amount: { total }
   - customer: { id }
   - currency: "KRW"

7. ✅ 고유 paymentId 생성
   - 타임스탬프 + 랜덤 문자열 조합
   - 형식: payment_${timestamp}_${random}

8. ✅ 에러 처리
   - 필수 필드 누락 시 400 에러
   - API 키 미설정 시 500 에러
   - PortOne API 실패 시 상세 에러 반환
   - 예외 처리 및 로깅

9. ✅ DB 저장 제외
   - 요구사항대로 DB에 저장하지 않고 응답만 반환

10. ✅ 로깅
    - 결제 요청 정보 콘솔 로그
    - 성공/실패 결과 로깅


📋 추가 설정 필요 항목
==============================================

1. 🔧 환경 변수 설정 (.env.local 파일 생성)
   ```
   PORTONE_API_SECRET=your_portone_api_secret_here
   ```
   
   ⚠️ 중요: 
   - PortOne 콘솔(https://developers.portone.io/)에서 API Secret 키 발급
   - .env.local 파일을 프로젝트 루트에 생성
   - API Secret 키를 절대 Git에 커밋하지 말 것


🧪 테스트 방법
==============================================

1. 환경 변수 설정 후 개발 서버 재시작
   ```bash
   npm run dev
   ```

2. API 테스트 예시 (curl)
   ```bash
   curl -X POST http://localhost:3000/api/payments \
     -H "Content-Type: application/json" \
     -d '{
       "billingKey": "billing_key_xxxxxxxx",
       "orderName": "테스트 상품",
       "amount": 10000,
       "customer": {
         "id": "customer_123"
       }
     }'
   ```

3. 예상 성공 응답
   ```json
   {
     "success": true,
     "paymentId": "payment_1234567890_abc123",
     "data": { /* PortOne 응답 데이터 */ }
   }
   ```


📚 참고 사항
==============================================

1. PortOne v2 API 문서: https://developers.portone.io/
2. Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
3. 실제 결제 테스트 시 PortOne 테스트 환경 사용 권장
4. 프로덕션 배포 시 환경 변수를 배포 환경에 설정해야 함


==============================================
구현 완료 일시: 2025-12-01
==============================================



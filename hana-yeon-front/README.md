# 하나:연(緣) Frontend 🎨

하나:연(緣) 금융 슈퍼앱의 프론트엔드 애플리케이션

## 📋 프로젝트 개요

하나:연(緣) 프론트엔드는 사용자에게 직관적이고 편리한 금융 서비스 인터페이스를 제공합니다. 연금 관리, 자산 통합 조회, 금융 상품 추천 등의 기능을 제공하며, 오픈뱅킹 서비스를 통해 여러 금융기관의 데이터를 한눈에 확인할 수 있습니다.

## ✨ 주요 기능

### 1. 🏠 대시보드

- 통합 자산 현황 조회
- 연금 현황 및 예상 수령액 확인
- 최근 거래 내역

### 2. 💰 연금 관리

- 국민연금, 퇴직연금, 개인연금 통합 관리
- 연금 수령 시뮬레이션
- 연금 추가 납입 추천

### 3. 🏦 오픈뱅킹

- 여러 금융기관 계좌 통합 조회
- 계좌 잔액 및 거래 내역 확인
- 계좌 간 이체

### 4. 📊 자산 분석

- 자산 포트폴리오 시각화
- 지출 패턴 분석
- 재무 건전성 평가

### 5. 🎯 금융 상품 추천

- AI 기반 맞춤 상품 추천
- 연금 상품 비교
- 투자 상품 추천

## 🛠️ 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios

## 📁 프로젝트 구조

```
hana-dundun-fe/
├── public/                 # 정적 파일
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   ├── layout/       # 레이아웃 컴포넌트
│   │   └── features/     # 기능별 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── lib/              # 유틸리티 함수
│   ├── services/         # API 서비스
│   ├── stores/           # 상태 관리
│   ├── types/            # TypeScript 타입 정의
│   └── styles/           # 전역 스타일
├── package.json
└── tsconfig.json
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# API 엔드포인트
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_OPENBANKING_API_URL=http://localhost:8081

# 인증
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8082

# 기타 설정
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev
# 또는
yarn dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 빌드된 애플리케이션 실행
npm run start
# 또는
yarn start
```

### 코드 품질 검사

```bash
# ESLint 실행
npm run lint
# 또는
yarn lint

# TypeScript 타입 체크
npm run type-check
# 또는
yarn type-check
```

## 📱 화면 구성

### 메인 대시보드

<!-- 스크린샷 삽입 위치 -->

![메인 대시보드](./docs/images/dashboard.png)

### 연금 관리 화면

<!-- 스크린샷 삽입 위치 -->

![연금 관리](./docs/images/pension-management.png)

### 오픈뱅킹 화면

<!-- 스크린샷 삽입 위치 -->

![오픈뱅킹](./docs/images/open-banking.png)

### 자산 분석 화면

<!-- 스크린샷 삽입 위치 -->

![자산 분석](./docs/images/asset-analysis.png)

## 🔌 API 연동

프론트엔드는 다음 백엔드 서비스와 통신합니다:

- **Main Backend** (`hana-dundun-back`): 메인 비즈니스 로직
- **OpenBanking Backend** (`openBanking-back`): 오픈뱅킹 데이터
- **Auth Backend** (`third-party-auth-back`): 인증/인가

자세한 API 명세는 각 백엔드 서비스의 문서를 참조하세요.

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test
# 또는
yarn test

# 테스트 커버리지 확인
npm run test:coverage
# 또는
yarn test:coverage
```

## 📦 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t hana-dundun-fe .

# 컨테이너 실행
docker run -p 3000:3000 hana-dundun-fe
```

## 🎨 디자인 시스템

프로젝트는 일관된 사용자 경험을 위해 디자인 시스템을 따릅니다:

- **컬러 팔레트**: 하나금융그룹 브랜드 컬러 기반
- **타이포그래피**: Pretendard 폰트 사용
- **컴포넌트**: shadcn/ui 기반 커스터마이징
- **반응형 디자인**: Mobile First 접근

## 🔒 보안

- HTTPS 통신 강제
- XSS 방지
- CSRF 토큰 검증
- 민감 정보 암호화
- 세션 타임아웃 관리

## 📈 성능 최적화

- 코드 스플리팅
- 이미지 최적화 (Next.js Image)
- 서버 사이드 렌더링 (SSR)
- 정적 사이트 생성 (SSG)
- API 응답 캐싱

## 🐛 트러블슈팅

### 포트가 이미 사용 중인 경우

```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

### 의존성 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 👨‍💻 개발자

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/HYEOK9">
          <img src="https://github.com/HYEOK9.png" width="100px;" alt="이재혁"/>
          <br />
          <sub><b>이재혁</b></sub>
        </a>
        <br />
        <sub>Full Stack Developer</sub>
        <br />
        <a href="mailto:leejaehyuck9@khu.ac.kr">leejaehyuck9@khu.ac.kr</a>
      </td>
    </tr>
  </table>
</div>

## 📄 라이선스

이 프로젝트는 하나금융그룹의 소유입니다.

## 📞 문의

프로젝트 관련 문의사항은 개발자 이메일로 연락주시기 바랍니다.

# 오픈뱅킹 Backend 🏦

하나:연(緣) 오픈뱅킹(마이데이터) 통합 서비스 백엔드

## 📋 프로젝트 개요

오픈뱅킹 백엔드는 금융결제원의 오픈뱅킹 API 표준을 따르는 마이데이터 통합 서비스입니다. 여러 금융기관의 계좌 정보를 통합 조회하고, 사용자의 금융 데이터를 안전하게 관리하며, 계좌 간 이체 등의 금융 거래를 중계하는 역할을 수행합니다.

## ✨ 주요 기능

### 1. 🔐 사용자 인증 및 인가

- OAuth 2.0 기반 인증
- 사용자 동의 관리
- 접근 토큰 발급 및 갱신
- 금융기관별 연동 관리

### 2. 💳 계좌 통합 조회

- 여러 금융기관 계좌 목록 조회
- 계좌 잔액 실시간 조회
- 계좌 상세 정보 조회
- 계좌 거래 내역 조회

### 3. 💸 계좌 이체

- 즉시 이체
- 예약 이체
- 이체 내역 조회
- 이체 한도 관리

### 4. 📊 금융 데이터 분석

- 거래 내역 집계
- 카테고리별 지출 분석
- 수입/지출 트렌드 분석
- 금융기관별 자산 분포

### 5. 🔄 금융기관 연동

- 하나은행 API 연동
- 신한은행 API 연동
- DB생명 API 연동
- 표준 API 인터페이스 제공

## 🛠️ 기술 스택

- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Build Tool**: Gradle
- **Database**: Oracle
- **ORM**: JPA (Hibernate)
- **Security**: Spring Security + OAuth 2.0
- **API Documentation**: Swagger (SpringDoc OpenAPI)

## 📁 프로젝트 구조

```
openBanking-back/
├── src/
│   ├── main/
│   │   ├── java/com/hana/openbanking/
│   │   │   ├── config/          # 설정 클래스
│   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   ├── repository/      # 데이터 접근 계층
│   │   │   ├── entity/          # JPA 엔티티
│   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   ├── oauth/           # OAuth 2.0 관련
│   │   │   ├── client/          # 금융기관 API 클라이언트
│   │   │   ├── util/            # 유틸리티 클래스
│   │   │   └── exception/       # 예외 처리
│   │   └── resources/
│   │       ├── application.yml  # 설정 파일
│   │       └── db/
│   │           └── migration/   # DB 마이그레이션
│   └── test/                    # 테스트 코드
├── build.gradle
└── settings.gradle
```

## 🚀 시작하기

### 필수 요구사항

- JDK 17 이상
- Gradle 8.x

## 🔐 보안 및 규제 준수

### 금융보안원 보안 가이드 준수

- 개인정보 암호화 (AES-256)
- 전송 데이터 암호화 (TLS 1.3)
- API 호출 로깅
- 접근 이력 관리

### 개인정보보호법 준수

- 사용자 동의 관리
- 데이터 보유 기간 관리
- 정보 주체 권리 보장
- 개인정보 처리 방침 게시

### 전자금융거래법 준수

- 거래 내역 저장 (5년)
- 보안 사고 대응 체계
- 이용자 피해 보상

## 📦 배포

### JAR 파일 생성

```bash
./gradlew bootJar
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t openbanking-back .

# 컨테이너 실행
docker run -p 8081:8081 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/openbanking \
  -e SPRING_DATASOURCE_USERNAME=openbanking_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  openbanking-back
```

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
        <a href="mailto:leejaehyuck9@khu.ac.kr">leejaehyuck9@khu.ac.kr</a>
      </td>
    </tr>
  </table>
</div>

## 📞 문의

프로젝트 관련 문의사항은 개발자 이메일로 연락주시기 바랍니다.

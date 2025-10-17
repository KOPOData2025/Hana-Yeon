# 하나:연(緣) Backend 🚀

하나:연(緣) 금융 슈퍼앱의 메인 백엔드 서버

## 📋 프로젝트 개요

하나:연(緣) 백엔드는 금융 슈퍼앱의 핵심 비즈니스 로직을 처리하는 메인 서버입니다. 사용자 인증, 연금 관리, 자산 통합, 금융 상품 추천 등의 주요 기능을 제공하며, 오픈뱅킹 및 각 금융기관 백엔드와 연동하여 통합 금융 서비스를 제공합니다.

## ✨ 주요 기능

### 1. 👤 사용자 관리

- 회원가입 및 로그인
- 본인인증 연동 (PASS)
- 사용자 프로필 관리
- 권한 관리 (RBAC)

### 2. 💰 연금 서비스

- 국민연금 정보 조회
- 퇴직연금 통합 관리
- 개인연금 관리
- 연금 수령액 시뮬레이션
- 연금 추가 납입 추천 알고리즘

### 3. 🏦 자산 통합

- 오픈뱅킹 API 연동
- 다수 금융기관 계좌 통합 조회
- 자산 포트폴리오 관리
- 거래 내역 통합 조회

### 4. 📊 데이터 분석

- 지출 패턴 분석
- 자산 증감 추이 분석
- 재무 건전성 평가
- 맞춤형 리포트 생성

### 5. 🎯 금융 상품 추천

- AI 기반 상품 추천 엔진
- 사용자 프로필 기반 맞춤 추천
- 상품 비교 및 상세 정보 제공

## 🛠️ 기술 스택

- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Build Tool**: Gradle
- **Database**: Oracle
- **ORM**: JPA (Hibernate)
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger (SpringDoc OpenAPI)

## 📁 프로젝트 구조

```
hana-dundun-back/
├── src/
│   ├── main/
│   │   ├── java/com/hana/dundun/
│   │   │   ├── config/          # 설정 클래스
│   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   ├── repository/      # 데이터 접근 계층
│   │   │   ├── entity/          # JPA 엔티티
│   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   ├── security/        # 보안 관련
│   │   │   ├── util/            # 유틸리티 클래스
│   │   │   ├── exception/       # 예외 처리
│   │   │   └── client/          # 외부 API 클라이언트
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

### 설치 및 빌드

```bash
# 프로젝트 의존성 다운로드
./gradlew build

# 테스트 스킵하고 빌드
./gradlew build -x test
```

### 개발 서버 실행

```bash
# Gradle을 통한 실행
./gradlew bootRun

# 또는 JAR 파일 실행
java -jar build/libs/hana-dundun-back-0.0.1-SNAPSHOT.jar
```

서버는 기본적으로 `http://localhost:8080`에서 실행됩니다.

## 📦 배포

### JAR 파일 생성

```bash
./gradlew bootJar
```

생성된 JAR 파일은 `build/libs/` 디렉토리에 있습니다.

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t hana-dundun-back .

# 컨테이너 실행
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/hana_dundun \
  -e SPRING_DATASOURCE_USERNAME=dundun_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  hana-dundun-back
```

### Docker Compose

```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f hana-dundun-back
```

## 🔒 보안

- JWT 기반 인증/인가
- BCrypt 암호화
- SQL Injection 방지 (JPA Parameterized Query)
- XSS 방지 (Spring Security)
- CORS 설정
- Rate Limiting
- API Key 인증 (외부 서비스)

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

## 📄 라이선스

이 프로젝트는 하나금융그룹의 소유입니다.

## 📞 문의

프로젝트 관련 문의사항은 개발자 이메일로 연락주시기 바랍니다.

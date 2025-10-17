REM ===================================================================
REM SCRIPT 용도   : 하나 든든 슈퍼앱 DB 스키마 및 트리거 정의
REM 작성자        : 이재혁
REM 작성일        : 2025-07-22
REM ===================================================================


-- 시퀀스 생성
CREATE SEQUENCE seq_user_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_log_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_error_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_alert_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_history_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_token_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_asset_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_txn_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_pension_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_insurance_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_term_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_quiz_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_result_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_point_history_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_upbit_user_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_quiz_option_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_voc_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_mission_id START WITH 1 INCREMENT BY 1;
-- =====================================================
-- 1. 사용자 테이블 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_USER (
    user_id NUMBER PRIMARY KEY,
    user_ci VARCHAR2(255) NOT NULL,
    user_name VARCHAR2(255) NOT NULL,
    phone_no VARCHAR2(20) NOT NULL UNIQUE,
    gender VARCHAR2(10) NOT NULL,
    birth_date VARCHAR2(10),
    user_pin_hashed VARCHAR2(255) NOT NULL,
    user_status VARCHAR2(20) NOT NULL,
    quiz_point NUMBER DEFAULT 0 NOT NULL,
    invest_type VARCHAR2(20),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);


COMMENT ON TABLE HANA_DUNDUN_USER IS '유저정보(사용자) 테이블';

COMMENT ON COLUMN HANA_DUNDUN_USER.user_id IS '유저 아이디 (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_USER.user_ci IS '유저 주민번호 해시값 (SHA256)';
COMMENT ON COLUMN HANA_DUNDUN_USER.user_name IS '유저 실명 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_USER.phone_no IS '유저 휴대폰 번호 (하이픈 제외 20자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_USER.gender IS '성별 (M: 남성, F: 여성)';
COMMENT ON COLUMN HANA_DUNDUN_USER.birth_date IS '생년월일 (YYYY-MM-DD 형식, VARCHAR2)';
COMMENT ON COLUMN HANA_DUNDUN_USER.user_pin_hashed IS '유저 PIN 해시값 (암호화된 6자리 비밀번호)';
COMMENT ON COLUMN HANA_DUNDUN_USER.user_status IS '유저 상태 (ACTIVE: 활성, INACTIVE: 비활성, BLOCKED: 정지)';
COMMENT ON COLUMN HANA_DUNDUN_USER.quiz_point IS '퀴즈 포인트 (기본값: 0)';
COMMENT ON COLUMN HANA_DUNDUN_USER.invest_type IS '투자성향 (안정형, 균형형, 공격형)';
COMMENT ON COLUMN HANA_DUNDUN_USER.created_at IS '계정 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_USER ADD CONSTRAINT chk_user_gender 
    CHECK (gender IN ('M', 'F'));
ALTER TABLE HANA_DUNDUN_USER ADD CONSTRAINT chk_user_status 
    CHECK (user_status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'));
ALTER TABLE HANA_DUNDUN_USER ADD CONSTRAINT chk_user_phone_format 
    CHECK (REGEXP_LIKE(phone_no, '^[0-9]{10,11}$'));
ALTER TABLE HANA_DUNDUN_USER ADD CONSTRAINT chk_invest_type 
    CHECK (invest_type IS NULL OR invest_type IN ('안정형', '균형형', '공격형'));
ALTER TABLE HANA_DUNDUN_USER ADD CONSTRAINT uk_user_ci 
    UNIQUE (user_ci);

-- =====================================================
-- 2. HANA_DUNDUN_ASSET_CATEGORY_MAPPING 테이블 (자산 카테고리 매핑) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_ASSET_CATEGORY_MAPPING (
    category_code NUMBER PRIMARY KEY,
    category_name VARCHAR2(255) NOT NULL,
    asset_type VARCHAR2(50) NOT NULL
);


COMMENT ON TABLE HANA_DUNDUN_ASSET_CATEGORY_MAPPING IS '자산 카테고리 코드와 이름 매핑 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ASSET_CATEGORY_MAPPING.category_code IS '자산 카테고리 코드 (PK, 숫자)';
COMMENT ON COLUMN HANA_DUNDUN_ASSET_CATEGORY_MAPPING.category_name IS '자산 카테고리 표시명 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_ASSET_CATEGORY_MAPPING.asset_type IS '자산 유형 (BANK_ACCOUNT: 계좌, PENSION: 연금, INSURANCE: 보험, STOCK: 주식, HOUSE: 부동산, ETC: 기타)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ASSET_CATEGORY_MAPPING ADD CONSTRAINT chk_asset_type_mapping 
    CHECK (asset_type IN ('BANK_ACCOUNT', 'PENSION', 'INSURANCE', 'STOCK', 'HOUSE', 'ETC'));
ALTER TABLE HANA_DUNDUN_ASSET_CATEGORY_MAPPING ADD CONSTRAINT uk_category_name 
    UNIQUE (category_name);

-- =====================================================
-- 3. HANA_DUNDUN_ASSET 테이블 (자산 기본 정보) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_ASSET (
    asset_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    asset_type VARCHAR2(50) NOT NULL,
    category_code NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_ASSET IS '사용자가 보유한 개별 자산 기본 정보 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ASSET.asset_id IS '자산 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_ASSET.user_id IS '자산 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_ASSET.asset_type IS '자산 세부 유형 (BANK_ACCOUNT: 계좌, STOCK: 주식, PENSION: 연금, INSURANCE: 보험, STOCK: 주식, HOUSE: 부동산)';
COMMENT ON COLUMN HANA_DUNDUN_ASSET.category_code IS '자산 카테고리 코드 (HANA_DUNDUN_ASSET_CATEGORY_MAPPING 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ASSET.created_at IS '자산 등록 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ASSET ADD CONSTRAINT fk_asset_user
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_ASSET ADD CONSTRAINT fk_asset_category 
    FOREIGN KEY (category_code) REFERENCES HANA_DUNDUN_ASSET_CATEGORY_MAPPING(category_code);
ALTER TABLE HANA_DUNDUN_ASSET ADD CONSTRAINT chk_asset_type_asset 
    CHECK (asset_type IN ('BANK_ACCOUNT', 'PENSION','PENSION_FUND', 'PENSION_TRUST', 'PENSION_INSURANCE', 'IRP', 'INSURANCE', 'STOCK', 'HOUSE', 'ETC'));


-- =====================================================
-- 4. HANA_DUNDUN_SMS_LOG 테이블 (SMS 발송 로그) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_SMS_LOG (
    log_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    phone_no VARCHAR2(20) NOT NULL,
    msg_type VARCHAR2(50),
    send_status VARCHAR2(20),
    send_msg VARCHAR2(4000),
    log_msg VARCHAR2(4000),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_SMS_LOG IS 'SMS 발송 로그 테이블';

COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.log_id IS 'SMS 로그 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.user_id IS '수신자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.phone_no IS '수신자 휴대폰 번호 (하이픈 제외 20자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.msg_type IS '메시지 유형 (OTP: 인증번호, ALERT: 알림)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.send_status IS '발송 상태 (SUCCESS: 성공, FAILED: 실패)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.send_msg IS '실제 발송된 메시지 내용 (최대 4000자)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.log_msg IS '내부 로그 메시지 (최대 4000자)';
COMMENT ON COLUMN HANA_DUNDUN_SMS_LOG.created_at IS '로그 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_SMS_LOG ADD CONSTRAINT fk_sms_log_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_SMS_LOG ADD CONSTRAINT chk_sms_msg_type
    CHECK (msg_type IN ('OTP', 'ALERT'));
ALTER TABLE HANA_DUNDUN_SMS_LOG ADD CONSTRAINT chk_sms_send_status
    CHECK (send_status IN ('SUCCESS', 'FAILED'));
ALTER TABLE HANA_DUNDUN_SMS_LOG ADD CONSTRAINT chk_sms_phone_format 
    CHECK (REGEXP_LIKE(phone_no, '^[0-9]{10,11}$'));

-- =====================================================
-- 5. HANA_DUNDUN_AUTH_LOG 테이블 (인증 로그) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_AUTH_LOG (
    log_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    phone_no VARCHAR2(20),
    auth_action VARCHAR2(50),
    auth_status VARCHAR2(20),
    log_msg VARCHAR2(4000),
    device_info VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_AUTH_LOG IS '사용자 인증 시도 로그 테이블';

COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.log_id IS '인증 로그 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.user_id IS '인증 시도 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.phone_no IS '인증에 사용된 휴대폰 번호 (하이픈 제외 20자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.auth_action IS '인증 액션 (REGISTER: 회원가입, LOGIN: 로그인, LOGOUT: 로그아웃, PASSWORD_CHANGE: 비밀번호 변경)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.auth_status IS '인증 결과 (SUCCESS: 성공, FAILED: 실패)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.log_msg IS '내부 로그 메시지 (최대 4000자)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.device_info IS '인증 시도 디바이스 정보 (최대 500자)';
COMMENT ON COLUMN HANA_DUNDUN_AUTH_LOG.created_at IS '로그 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_AUTH_LOG ADD CONSTRAINT fk_auth_log_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_AUTH_LOG ADD CONSTRAINT chk_auth_action
    CHECK (auth_action IN ('REGISTER', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE'));
ALTER TABLE HANA_DUNDUN_AUTH_LOG ADD CONSTRAINT chk_auth_status 
    CHECK (auth_status IN ('SUCCESS', 'FAILED'));
ALTER TABLE HANA_DUNDUN_AUTH_LOG ADD CONSTRAINT chk_auth_phone_format 
    CHECK (phone_no IS NULL OR REGEXP_LIKE(phone_no, '^[0-9]{10,11}$'));

-- =====================================================
-- 6. HANA_DUNDUN_ERROR_LOG 테이블 (시스템 오류 로그) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_ERROR_LOG (
    error_id NUMBER PRIMARY KEY,
    user_id NUMBER,
    error_code VARCHAR2(50),
    error_msg VARCHAR2(500),
    error_msg_detail CLOB,
    http_status NUMBER,
    device_info VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_ERROR_LOG IS '시스템 오류 로그 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.error_id IS '오류 로그 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.user_id IS '오류 발생 사용자 ID (HANA_DUNDUN_USER 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.error_code IS '오류 코드 (50자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.error_msg IS '오류 메시지 요약 (최대 500자)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.error_msg_detail IS '오류 메시지 상세 or 스택 트레이스 (CLOB)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.http_status IS 'HTTP 상태 코드 (예: 400, 500)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.device_info IS '오류 디바이스 정보 (최대 500자)';
COMMENT ON COLUMN HANA_DUNDUN_ERROR_LOG.created_at IS '로그 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ERROR_LOG ADD CONSTRAINT fk_error_log_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_ERROR_LOG ADD CONSTRAINT chk_http_status 
    CHECK (http_status IS NULL OR (100 <= http_status AND http_status <= 599));

-- =====================================================
-- 7. HANA_DUNDUN_ALERT_SETTING 테이블 (알림 설정) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_ALERT_SETTING (
    alert_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    opponent_phone_no VARCHAR2(20),
    amount_threshold NUMBER(18),
    notify_enabled VARCHAR2(1) DEFAULT 'Y',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_ALERT_SETTING IS '사용자별 알림 설정 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.alert_id IS '알림 설정 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.user_id IS '알림 설정 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.opponent_phone_no IS '상대방 휴대폰 번호 (특정 거래 알림용, 하이픈 제외 20자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.amount_threshold IS '알림 발생 금액 임계값 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.notify_enabled IS '알림 활성화 여부 (Y: 활성, N: 비활성)';
COMMENT ON COLUMN HANA_DUNDUN_ALERT_SETTING.created_at IS '설정 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ALERT_SETTING ADD CONSTRAINT fk_alert_setting_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_ALERT_SETTING ADD CONSTRAINT chk_notify_enabled 
    CHECK (notify_enabled IN ('Y', 'N'));
ALTER TABLE HANA_DUNDUN_ALERT_SETTING ADD CONSTRAINT chk_amount_threshold 
    CHECK (amount_threshold IS NULL OR amount_threshold > 0);
ALTER TABLE HANA_DUNDUN_ALERT_SETTING ADD CONSTRAINT chk_opponent_phone_format 
    CHECK (opponent_phone_no IS NULL OR REGEXP_LIKE(opponent_phone_no, '^[0-9]{10,11}$'));

-- =====================================================
-- 8. HANA_DUNDUN_USER_ASSET_HISTORY 테이블 (사용자 자산 로그) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_USER_ASSET_HISTORY (
    history_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    snapshot_date DATE NOT NULL,
    total_balance NUMBER(18) NOT NULL,
    category_code NUMBER NOT NULL,
    category_balance NUMBER(18) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_USER_ASSET_HISTORY IS '사용자 자산 잔고 스냅샷 테이블';

COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.history_id IS '자산 로그 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.user_id IS '자산 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.snapshot_date IS '자산 스냅샷 생성 날짜 (YYYY-MM-DD)';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.total_balance IS '전체 자산 잔고 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.category_code IS '자산 카테고리 코드 (HANA_DUNDUN_ASSET_CATEGORY_MAPPING 참조)';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.category_balance IS '카테고리별 자산 잔고 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_USER_ASSET_HISTORY.created_at IS '로그 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_USER_ASSET_HISTORY ADD CONSTRAINT fk_asset_history_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_USER_ASSET_HISTORY ADD CONSTRAINT fk_asset_history_category 
    FOREIGN KEY (category_code) REFERENCES HANA_DUNDUN_ASSET_CATEGORY_MAPPING(category_code);
ALTER TABLE HANA_DUNDUN_USER_ASSET_HISTORY ADD CONSTRAINT chk_total_balance 
    CHECK (total_balance >= 0);
ALTER TABLE HANA_DUNDUN_USER_ASSET_HISTORY ADD CONSTRAINT chk_category_balance 
    CHECK (category_balance >= 0);
ALTER TABLE HANA_DUNDUN_USER_ASSET_HISTORY ADD CONSTRAINT uk_user_snapshot_category 
    UNIQUE (user_id, snapshot_date, category_code);

-- =====================================================
-- 9. HANA_DUNDUN_REFRESH_TOKEN 테이블 (리프레시 토큰) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_REFRESH_TOKEN (
    token_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    refresh_token VARCHAR2(500) NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    device_info VARCHAR2(500),
    is_valid VARCHAR2(1) DEFAULT 'Y'
);


COMMENT ON TABLE HANA_DUNDUN_REFRESH_TOKEN IS '사용자 리프레시 토큰 테이블';

COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.token_id IS '토큰 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.user_id IS '토큰 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.refresh_token IS '리프레시 토큰 문자열 (최대 500자)';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.issued_at IS '토큰 발급 일시';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.expires_at IS '토큰 만료 일시';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.device_info IS '토큰 사용 디바이스 정보 (최대 500자)';
COMMENT ON COLUMN HANA_DUNDUN_REFRESH_TOKEN.is_valid IS '토큰 유효성 여부 (Y: 유효, N: 무효)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_REFRESH_TOKEN ADD CONSTRAINT fk_refresh_token_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_REFRESH_TOKEN ADD CONSTRAINT chk_token_valid 
    CHECK (is_valid IN ('Y', 'N'));
ALTER TABLE HANA_DUNDUN_REFRESH_TOKEN ADD CONSTRAINT chk_token_expiry 
    CHECK (expires_at > issued_at);
ALTER TABLE HANA_DUNDUN_REFRESH_TOKEN ADD CONSTRAINT uk_refresh_token 
    UNIQUE (refresh_token);


-- =====================================================
-- 10. HANA_DUNDUN_ACCOUNT_DETAIL 테이블 (계좌 상세 정보) 생성 (추후 삭제 예정)
-- =====================================================
CREATE TABLE HANA_DUNDUN_ACCOUNT_DETAIL (
    account_num VARCHAR2(100) PRIMARY KEY,
    asset_id NUMBER NOT NULL,
    user_id NUMBER NOT NULL,
    institution_code VARCHAR2(50) NOT NULL,
    account_type VARCHAR2(50) NOT NULL,
    product_name VARCHAR2(255),
    account_status VARCHAR2(20),
    account_issue_date DATE,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);


COMMENT ON TABLE HANA_DUNDUN_ACCOUNT_DETAIL IS '계좌 상세 정보 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.account_num IS '계좌번호 (PK)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.asset_id IS '연관 자산 ID (HANA_DUNDUN_ASSET 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.user_id IS '계좌 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.institution_code IS '금융기관 코드 (HANA_DUNDUN_INSTITUTION_MAPPING 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.account_type IS '계좌 유형 (CHECKING: 입출금, SAVINGS: 적금, PENSION_FUND: 연금저축펀드, PENSION_TRUST: 연금저축신탁, PENSION_INSURANCE: 연금저축보험, STOCK: 주식)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.product_name IS '금융 상품명 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.account_status IS '계좌 상태 (ACTIVE: 활성, CLOSED: 해지)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_DETAIL.account_issue_date IS '계좌 개설일 (YYYY-MM-DD)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ACCOUNT_DETAIL ADD CONSTRAINT fk_account_detail_asset 
    FOREIGN KEY (asset_id) REFERENCES HANA_DUNDUN_ASSET(asset_id);
ALTER TABLE HANA_DUNDUN_ACCOUNT_DETAIL ADD CONSTRAINT fk_account_detail_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_ACCOUNT_DETAIL ADD CONSTRAINT chk_account_type 
    CHECK (account_type IN ('CHECKING', 'SAVINGS', 'PENSION_FUND', 'PENSION_TRUST', 'PENSION_INSURANCE', 'STOCK', 'IRP'));
ALTER TABLE HANA_DUNDUN_ACCOUNT_DETAIL ADD CONSTRAINT chk_account_status 
    CHECK (account_status IS NULL OR account_status IN ('ACTIVE', 'CLOSED'));

-- =====================================================
-- 11. HANA_DUNDUN_ACCOUNT_TRANSACTION 테이블 (계좌 거래 내역) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION (
    txn_id NUMBER PRIMARY KEY,
    txn_date DATE NOT NULL,
    account_num VARCHAR2(100) NOT NULL,
    asset_id NUMBER NOT NULL,
    txn_type VARCHAR2(50) NOT NULL,
    amount NUMBER(18),
    balance_after NUMBER(18),
    description VARCHAR2(1000),
    opponent_account_num VARCHAR2(100),
    category VARCHAR2(50),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION IS '계좌 거래 내역 테이블';

COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.txn_id IS '거래 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.txn_date IS '거래 발생일 (YYYY-MM-DD)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.account_num IS '거래 계좌번호 (HANA_DUNDUN_ACCOUNT_DETAIL 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.asset_id IS '거래 자산 ID (ACCOUNT_DETAIL 참조)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.txn_type IS '거래 유형 (DEPOSIT: 입금, WITHDRAWAL: 출금, TRANSFER: 이체)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.amount IS '거래 금액 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.balance_after IS '거래 후 잔고 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.description IS '거래 설명 (최대 1000자)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.opponent_account_num IS '상대방 계좌번호 (이체 거래시, 최대 100자)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.category IS '거래 카테고리 (FOOD: 식비, TRANSPORT: 교통비, SALARY: 급여, ETC: 기타)';
COMMENT ON COLUMN HANA_DUNDUN_ACCOUNT_TRANSACTION.created_at IS '거래 기록 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION ADD CONSTRAINT fk_txn_account_detail 
    FOREIGN KEY (account_num) REFERENCES HANA_DUNDUN_ACCOUNT_DETAIL(account_num);
ALTER TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION ADD CONSTRAINT chk_txn_type 
    CHECK (txn_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'ETC'));
ALTER TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION ADD CONSTRAINT chk_txn_amount 
    CHECK (amount IS NULL OR amount > 0);
ALTER TABLE HANA_DUNDUN_ACCOUNT_TRANSACTION ADD CONSTRAINT chk_balance_after 
    CHECK (balance_after IS NULL OR balance_after >= 0);

-- =====================================================
-- 12. HANA_DUNDUN_PENSION_DETAIL 테이블 (연금 상세 정보) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_PENSION_DETAIL (
    pension_id NUMBER PRIMARY KEY,
    asset_id NUMBER,
    user_id NUMBER NOT NULL,
    plan_type VARCHAR2(50) NOT NULL,
    institution_code VARCHAR2(50) NOT NULL,
    status VARCHAR2(20) NOT NULL,
    total_paid NUMBER(18) NOT NULL,
    start_date DATE,
    expected_monthly_income NUMBER(18),
    retirement_age NUMBER,
    estimated_receive_date DATE
);


COMMENT ON TABLE HANA_DUNDUN_PENSION_DETAIL IS '연금 자산 상세 정보 테이블';

COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.pension_id IS '연금 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.asset_id IS '연관 자산 ID (HANA_DUNDUN_ASSET 참조)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.user_id IS '연금 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.plan_type IS '연금 계획 유형 (NATIONAL: 국민연금, PRIVATE: 개인연금)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.institution_code IS '연금 기관 코드 (HANA_DUNDUN_INSTITUTION_MAPPING 참조)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.status IS '연금 계획 상태 (ACTIVE: 활성, MATURED: 만기)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.total_paid IS '총 납입 금액 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.start_date IS '연금 계획 시작일 (YYYY-MM-DD)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.expected_monthly_income IS '예상 월 수령액 (18자리)';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.retirement_age IS '예상 은퇴 연령';
COMMENT ON COLUMN HANA_DUNDUN_PENSION_DETAIL.estimated_receive_date IS '연금 수령 예상 시작일 (YYYY-MM-DD)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT fk_pension_detail_asset 
    FOREIGN KEY (asset_id) REFERENCES HANA_DUNDUN_ASSET(asset_id);
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT fk_pension_detail_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT chk_pension_status 
    CHECK (status IN ('ACTIVE', 'MATURED'));
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT chk_total_paid 
    CHECK (total_paid >= 0);
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT chk_expected_monthly_income 
    CHECK (expected_monthly_income IS NULL OR expected_monthly_income >= 0);
ALTER TABLE HANA_DUNDUN_PENSION_DETAIL ADD CONSTRAINT chk_retirement_age 
    CHECK (retirement_age IS NULL OR (retirement_age >= 50 AND retirement_age <= 80));

-- =====================================================
-- 13. HANA_DUNDUN_INSURANCE_DETAIL 테이블 (보험 상세 정보) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_INSURANCE_DETAIL (
    insurance_id NUMBER PRIMARY KEY,
    asset_id NUMBER,
    user_id NUMBER NOT NULL,
    institution_code VARCHAR2(50) NOT NULL,
    product_name VARCHAR2(255),
    insu_type VARCHAR2(50),
    insu_status VARCHAR2(20),
    premium NUMBER(18),
    start_date DATE,
    expiration_date DATE
);


COMMENT ON TABLE HANA_DUNDUN_INSURANCE_DETAIL IS '보험 자산 상세 정보 테이블';


COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.insurance_id IS '보험 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.asset_id IS '연관 자산 ID (HANA_DUNDUN_ASSET 참조)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.user_id IS '보험 계약자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.institution_code IS '보험사 코드 (HANA_DUNDUN_INSTITUTION_MAPPING 참조)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.product_name IS '보험 상품명 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.insu_type IS '보험 유형 (LIFE: 생명보험, HEALTH: 건강보험, CAR: 자동차보험, ETC: 기타)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.insu_status IS '보험 상태 (ACTIVE: 활성, CLOSED: 해지, EXPIRED: 만료)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.start_date IS '보험 계약 시작일 (YYYY-MM-DD)';
COMMENT ON COLUMN HANA_DUNDUN_INSURANCE_DETAIL.expiration_date IS '보험 계약 만료일 (YYYY-MM-DD)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_INSURANCE_DETAIL ADD CONSTRAINT fk_insurance_detail_asset 
    FOREIGN KEY (asset_id) REFERENCES HANA_DUNDUN_ASSET(asset_id);
ALTER TABLE HANA_DUNDUN_INSURANCE_DETAIL ADD CONSTRAINT fk_insurance_detail_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_INSURANCE_DETAIL ADD CONSTRAINT chk_insu_type 
    CHECK (insu_type IS NULL OR insu_type IN ('LIFE', 'HEALTH', 'CAR', 'ETC'));
ALTER TABLE HANA_DUNDUN_INSURANCE_DETAIL ADD CONSTRAINT chk_insu_status 
    CHECK (insu_status IS NULL OR insu_status IN ('ACTIVE', 'CLOSED', 'EXPIRED'));
ALTER TABLE HANA_DUNDUN_INSURANCE_DETAIL ADD CONSTRAINT chk_insurance_dates 
    CHECK (start_date IS NULL OR expiration_date IS NULL OR expiration_date > start_date);

-- =====================================================
-- 14. HANA_DUNDUN_INSTITUTION_MAPPING 테이블 (기관 매핑) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_INSTITUTION_MAPPING (
    institution_code VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    type VARCHAR2(50),
    logo_url VARCHAR2(500)
);


COMMENT ON TABLE HANA_DUNDUN_INSTITUTION_MAPPING IS '금융기관 코드와 이름 매핑 테이블';

COMMENT ON COLUMN HANA_DUNDUN_INSTITUTION_MAPPING.institution_code IS '기관 코드 (PK, 10자 이내)';
COMMENT ON COLUMN HANA_DUNDUN_INSTITUTION_MAPPING.name IS '기관명 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_INSTITUTION_MAPPING.type IS '기관 유형 (BANK: 은행, STOCK: 주식, INSURANCE: 보험사, PENSION: 연금기관)';
COMMENT ON COLUMN HANA_DUNDUN_INSTITUTION_MAPPING.logo_url IS '기관 로고 URL (최대 500자)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_INSTITUTION_MAPPING ADD CONSTRAINT chk_institution_type 
    CHECK (type IS NULL OR type IN ('BANK', 'STOCK', 'INSURANCE', 'PENSION'));
ALTER TABLE HANA_DUNDUN_INSTITUTION_MAPPING ADD CONSTRAINT uk_institution_name 
    UNIQUE (name);

-- =====================================================
-- 15. HANA_DUNDUN_TERM 테이블 (약관 및 정적 콘텐츠) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_TERM (
    term_id NUMBER PRIMARY KEY,
    title VARCHAR2(255),
    content CLOB
);


COMMENT ON TABLE HANA_DUNDUN_TERM IS '약관 및 기타 정적 콘텐츠 테이블';

COMMENT ON COLUMN HANA_DUNDUN_TERM.term_id IS '약관 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_TERM.title IS '약관 제목 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_TERM.content IS '약관 내용 (CLOB)';

-- =====================================================
-- 16. HANA_DUNDUN_QUIZ 테이블 (퀴즈 문제) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_QUIZ (
    quiz_id NUMBER PRIMARY KEY,
    quiz_text VARCHAR2(1000) NOT NULL,
    answer VARCHAR2(1000) NOT NULL,
    point NUMBER NOT NULL,
    explanation CLOB,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_QUIZ IS '퀴즈 목록(문제, 정답, 포인트) 테이블';

COMMENT ON COLUMN HANA_DUNDUN_QUIZ.quiz_id IS '퀴즈 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ.quiz_text IS '퀴즈 문제 내용 (최대 1000자)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ.answer IS '퀴즈 정답 (최대 1000자)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ.point IS '퀴즈 정답 시 획득 포인트';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ.explanation IS '퀴즈 정답 설명 (CLOB)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ.created_at IS '퀴즈 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_QUIZ ADD CONSTRAINT chk_quiz_point 
    CHECK (point >= 0);


-- 퀴즈 보기(선택지) 테이블
CREATE TABLE HANA_DUNDUN_QUIZ_OPTION (
    option_id NUMBER PRIMARY KEY,
    quiz_id NUMBER NOT NULL,
    option_text VARCHAR2(1000) NOT NULL,
    is_correct VARCHAR2(1) DEFAULT 'N' NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_quiz_option_quiz FOREIGN KEY (quiz_id)
        REFERENCES HANA_DUNDUN_QUIZ (quiz_id),
    CONSTRAINT chk_quiz_option_is_correct CHECK (is_correct IN ('Y', 'N'))
);

COMMENT ON TABLE HANA_DUNDUN_QUIZ_OPTION IS '객관식 퀴즈의 선택지 테이블';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_OPTION.option_id IS '선택지 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_OPTION.quiz_id IS '어떤 퀴즈의 선택지인지 (FK)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_OPTION.option_text IS '선택지 내용';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_OPTION.is_correct IS '정답 여부 (Y/N)';


-- =====================================================
-- 17. HANA_DUNDUN_QUIZ_RESULT 테이블 (퀴즈 결과) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_QUIZ_RESULT (
    result_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    quiz_id NUMBER NOT NULL,
    selected_answer VARCHAR2(4000) NOT NULL,
    is_correct VARCHAR2(1) NOT NULL,
    earned_point NUMBER NOT NULL,
    answered_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_QUIZ_RESULT IS '사용자의 퀴즈 응답 결과 테이블';

COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.result_id IS '퀴즈 결과 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.user_id IS '퀴즈 응답자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.quiz_id IS '응답한 퀴즈 ID (HANA_DUNDUN_QUIZ 참조)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.selected_answer IS '사용자가 선택한 답안 (최대 4000자)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.is_correct IS '정답 여부 (Y: 정답, N: 오답)';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.earned_point IS '해당 퀴즈에서 획득한 포인트';
COMMENT ON COLUMN HANA_DUNDUN_QUIZ_RESULT.answered_at IS '퀴즈 응답 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_QUIZ_RESULT ADD CONSTRAINT fk_quiz_result_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_QUIZ_RESULT ADD CONSTRAINT fk_quiz_result_quiz 
    FOREIGN KEY (quiz_id) REFERENCES HANA_DUNDUN_QUIZ(quiz_id);
ALTER TABLE HANA_DUNDUN_QUIZ_RESULT ADD CONSTRAINT chk_is_correct 
    CHECK (is_correct IN ('Y', 'N'));
ALTER TABLE HANA_DUNDUN_QUIZ_RESULT ADD CONSTRAINT chk_earned_point 
    CHECK (earned_point >= 0);

-- =====================================================
-- 18. HANA_DUNDUN_POINT_HISTORY 테이블 (포인트 로그) 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_POINT_HISTORY (
    history_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    point_before NUMBER NOT NULL,
    point_after NUMBER NOT NULL,
    reason VARCHAR2(255),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


COMMENT ON TABLE HANA_DUNDUN_POINT_HISTORY IS '사용자 포인트 변동 로그 테이블';

COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.history_id IS '포인트 로그 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.user_id IS '포인트 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.point_before IS '변동 전 포인트';
COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.point_after IS '변동 후 포인트';
COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.reason IS '포인트 변동 사유 (QUIZ_CORRECT: 퀴즈 정답, REWARD: 보상, MINUS: 차감)';
COMMENT ON COLUMN HANA_DUNDUN_POINT_HISTORY.created_at IS '로그 생성 일시 (자동 생성)';

-- 제약사항
ALTER TABLE HANA_DUNDUN_POINT_HISTORY ADD CONSTRAINT fk_point_history_user 
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_POINT_HISTORY ADD CONSTRAINT chk_point_before 
    CHECK (point_before >= 0);
ALTER TABLE HANA_DUNDUN_POINT_HISTORY ADD CONSTRAINT chk_point_after 
    CHECK (point_after >= 0);
ALTER TABLE HANA_DUNDUN_POINT_HISTORY ADD CONSTRAINT chk_reason 
    CHECK (reason IS NULL OR reason IN ('QUIZ_CORRECT', 'REWARD', 'MINUS'));



-- =====================================================
-- 인덱스 생성
-- =====================================================

-- 성능 향상을 위한 인덱스
CREATE INDEX idx_sms_log_user_id ON HANA_DUNDUN_SMS_LOG(user_id);
CREATE INDEX idx_sms_log_created_at ON HANA_DUNDUN_SMS_LOG(created_at);
CREATE INDEX idx_auth_log_user_id ON HANA_DUNDUN_AUTH_LOG(user_id);
CREATE INDEX idx_auth_log_created_at ON HANA_DUNDUN_AUTH_LOG(created_at);
CREATE INDEX idx_error_log_user_id ON HANA_DUNDUN_ERROR_LOG(user_id);
CREATE INDEX idx_error_log_created_at ON HANA_DUNDUN_ERROR_LOG(created_at);
CREATE INDEX idx_asset_history_user_date ON HANA_DUNDUN_USER_ASSET_HISTORY(user_id, snapshot_date);
CREATE INDEX idx_refresh_token_user_id ON HANA_DUNDUN_REFRESH_TOKEN(user_id);
CREATE INDEX idx_refresh_token_expires ON HANA_DUNDUN_REFRESH_TOKEN(expires_at);
CREATE INDEX idx_asset_user_id ON HANA_DUNDUN_ASSET(user_id);
CREATE INDEX idx_account_detail_user_id ON HANA_DUNDUN_ACCOUNT_DETAIL(user_id);
CREATE INDEX idx_account_txn_date ON HANA_DUNDUN_ACCOUNT_TRANSACTION(txn_date);
CREATE INDEX idx_account_txn_account ON HANA_DUNDUN_ACCOUNT_TRANSACTION(account_num, asset_id);
CREATE INDEX idx_pension_detail_user_id ON HANA_DUNDUN_PENSION_DETAIL(user_id);
CREATE INDEX idx_insurance_detail_user_id ON HANA_DUNDUN_INSURANCE_DETAIL(user_id);
CREATE INDEX idx_quiz_result_user_id ON HANA_DUNDUN_QUIZ_RESULT(user_id);
CREATE INDEX idx_quiz_result_quiz_id ON HANA_DUNDUN_QUIZ_RESULT(quiz_id);
CREATE INDEX idx_point_history_user_id ON HANA_DUNDUN_POINT_HISTORY(user_id);
CREATE INDEX idx_point_history_created_at ON HANA_DUNDUN_POINT_HISTORY(created_at);
CREATE INDEX idx_mission_user_id ON HANA_DUNDUN_USER_MISSION(user_id);
CREATE INDEX idx_mission_created_at ON HANA_DUNDUN_USER_MISSION(created_at);


-- =====================================================
-- 트리거 생성
-- =====================================================

-- HANA_DUNDUN_USER
CREATE OR REPLACE TRIGGER trg_user_id
BEFORE INSERT ON HANA_DUNDUN_USER
FOR EACH ROW
WHEN (NEW.user_id IS NULL)
BEGIN
    SELECT seq_user_id.NEXTVAL INTO :NEW.user_id FROM dual;
END;
/

-- HANA_DUNDUN_SMS_LOG
CREATE OR REPLACE TRIGGER trg_sms_log_id
BEFORE INSERT ON HANA_DUNDUN_SMS_LOG
FOR EACH ROW
WHEN (NEW.log_id IS NULL)
BEGIN
    SELECT seq_log_id.NEXTVAL INTO :NEW.log_id FROM dual;
END;
/

-- HANA_DUNDUN_AUTH_LOG
CREATE OR REPLACE TRIGGER trg_auth_log_id
BEFORE INSERT ON HANA_DUNDUN_AUTH_LOG
FOR EACH ROW
WHEN (NEW.log_id IS NULL)
BEGIN
    SELECT seq_log_id.NEXTVAL INTO :NEW.log_id FROM dual;
END;
/

-- HANA_DUNDUN_ERROR_LOG
CREATE OR REPLACE TRIGGER trg_error_log_id
BEFORE INSERT ON HANA_DUNDUN_ERROR_LOG
FOR EACH ROW
WHEN (NEW.error_id IS NULL)
BEGIN
    SELECT seq_error_id.NEXTVAL INTO :NEW.error_id FROM dual;
END;
/

-- HANA_DUNDUN_ALERT_SETTING
CREATE OR REPLACE TRIGGER trg_alert_id
BEFORE INSERT ON HANA_DUNDUN_ALERT_SETTING
FOR EACH ROW
WHEN (NEW.alert_id IS NULL)
BEGIN
    SELECT seq_alert_id.NEXTVAL INTO :NEW.alert_id FROM dual;
END;
/

-- HANA_DUNDUN_USER_ASSET_HISTORY
CREATE OR REPLACE TRIGGER trg_user_asset_history_id
BEFORE INSERT ON HANA_DUNDUN_USER_ASSET_HISTORY
FOR EACH ROW
WHEN (NEW.history_id IS NULL)
BEGIN
    SELECT seq_history_id.NEXTVAL INTO :NEW.history_id FROM dual;
END;
/

-- HANA_DUNDUN_REFRESH_TOKEN
CREATE OR REPLACE TRIGGER trg_refresh_token_id
BEFORE INSERT ON HANA_DUNDUN_REFRESH_TOKEN
FOR EACH ROW
WHEN (NEW.token_id IS NULL)
BEGIN
    SELECT seq_token_id.NEXTVAL INTO :NEW.token_id FROM dual;
END;
/

-- HANA_DUNDUN_ASSET
CREATE OR REPLACE TRIGGER trg_asset_id
BEFORE INSERT ON HANA_DUNDUN_ASSET
FOR EACH ROW
WHEN (NEW.asset_id IS NULL)
BEGIN
    SELECT seq_asset_id.NEXTVAL INTO :NEW.asset_id FROM dual;
END;
/

-- HANA_DUNDUN_ACCOUNT_TRANSACTION
CREATE OR REPLACE TRIGGER trg_txn_id
BEFORE INSERT ON HANA_DUNDUN_ACCOUNT_TRANSACTION
FOR EACH ROW
WHEN (NEW.txn_id IS NULL)
BEGIN
    SELECT seq_txn_id.NEXTVAL INTO :NEW.txn_id FROM dual;
END;
/

-- HANA_DUNDUN_PENSION_DETAIL
CREATE OR REPLACE TRIGGER trg_pension_id
BEFORE INSERT ON HANA_DUNDUN_PENSION_DETAIL
FOR EACH ROW
WHEN (NEW.pension_id IS NULL)
BEGIN
    SELECT seq_pension_id.NEXTVAL INTO :NEW.pension_id FROM dual;
END;
/

-- HANA_DUNDUN_INSURANCE_DETAIL
CREATE OR REPLACE TRIGGER trg_insurance_id
BEFORE INSERT ON HANA_DUNDUN_INSURANCE_DETAIL
FOR EACH ROW
WHEN (NEW.insurance_id IS NULL)
BEGIN
    SELECT seq_insurance_id.NEXTVAL INTO :NEW.insurance_id FROM dual;
END;
/

-- HANA_DUNDUN_TERM
CREATE OR REPLACE TRIGGER trg_term_id
BEFORE INSERT ON HANA_DUNDUN_TERM
FOR EACH ROW
WHEN (NEW.term_id IS NULL)
BEGIN
    SELECT seq_term_id.NEXTVAL INTO :NEW.term_id FROM dual;
END;
/

-- HANA_DUNDUN_QUIZ
CREATE OR REPLACE TRIGGER trg_quiz_id
BEFORE INSERT ON HANA_DUNDUN_QUIZ
FOR EACH ROW
WHEN (NEW.quiz_id IS NULL)
BEGIN
    SELECT seq_quiz_id.NEXTVAL INTO :NEW.quiz_id FROM dual;
END;
/

-- HANA_DUNDUN_QUIZ_RESULT
CREATE OR REPLACE TRIGGER trg_result_id
BEFORE INSERT ON HANA_DUNDUN_QUIZ_RESULT
FOR EACH ROW
WHEN (NEW.result_id IS NULL)
BEGIN
    SELECT seq_result_id.NEXTVAL INTO :NEW.result_id FROM dual;
END;
/

-- HANA_DUNDUN_POINT_HISTORY
CREATE OR REPLACE TRIGGER trg_point_history_id
BEFORE INSERT ON HANA_DUNDUN_POINT_HISTORY
FOR EACH ROW
WHEN (NEW.history_id IS NULL)
BEGIN
    SELECT seq_point_history_id.NEXTVAL INTO :NEW.history_id FROM dual;
END;
/

-- HANA_DUNDUN_QUIZ_OPTION
CREATE OR REPLACE TRIGGER trg_quiz_option_id
BEFORE INSERT ON HANA_DUNDUN_QUIZ_OPTION
FOR EACH ROW
WHEN (NEW.option_id IS NULL)
BEGIN
    SELECT seq_quiz_option_id.NEXTVAL INTO :NEW.option_id FROM DUAL;
END;
/

-- HANA_DUNDUN_UPBIT_USER
CREATE OR REPLACE TRIGGER trg_upbit_user_updated_at
BEFORE UPDATE ON HANA_DUNDUN_UPBIT_USER
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- HANA_DUNDUN_VOC
CREATE OR REPLACE TRIGGER trg_voc_id
BEFORE INSERT ON HANA_DUNDUN_VOC
FOR EACH ROW
WHEN (NEW.id IS NULL)
BEGIN
    SELECT seq_voc_id.NEXTVAL INTO :NEW.id FROM dual;
END;
/

CREATE OR REPLACE TRIGGER trg_mission_id
BEFORE INSERT ON HANA_DUNDUN_USER_MISSION
FOR EACH ROW
WHEN (NEW.mission_id IS NULL)
BEGIN
    SELECT seq_mission_id.NEXTVAL INTO :NEW.mission_id FROM dual;
END;
/

-- =====================================================
-- 12. Upbit 사용자 정보 테이블 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_UPBIT_USER (
    user_id NUMBER PRIMARY KEY,
    access_key VARCHAR2(500) NOT NULL,
    secret_key VARCHAR2(500) NOT NULL,
    is_active VARCHAR2(1) DEFAULT 'Y' NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

COMMENT ON TABLE HANA_DUNDUN_UPBIT_USER IS 'Upbit 사용자 API 키 관리 테이블';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.user_id IS '사용자 ID (PK)';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.access_key IS 'Upbit API Access Key (암호화 저장)';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.secret_key IS 'Upbit API Secret Key (암호화 저장)';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.is_active IS '활성 상태 (Y: 활성, N: 비활성)';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.created_at IS '생성일시';
COMMENT ON COLUMN HANA_DUNDUN_UPBIT_USER.updated_at IS '수정일시';


-- =====================================================
-- 13. 고객의 소리 테이블 생성
-- =====================================================
CREATE TABLE HANA_DUNDUN_VOC (
    id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    content CLOB NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);


-- =====================================================
-- 14. 사용자 미션
-- =====================================================

CREATE TABLE HANA_DUNDUN_USER_MISSION (
    mission_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    title VARCHAR2(255) NOT NULL,
    reward NUMBER NOT NULL,
    is_completed VARCHAR2(1) DEFAULT 'N' NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

COMMENT ON TABLE HANA_DUNDUN_USER_MISSION IS '사용자 미션 테이블';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.mission_id IS '미션 id (PK, SEQ)';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.user_id IS '미션 소유자 사용자 ID';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.title IS '미션 제목 (최대 255자)';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.reward IS '미션 보상 (하나머니)';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.is_completed IS '미션 완료 여부 (Y: 완료, N: 미완료)';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.created_at IS '미션 생성 일시 (자동 생성)';
COMMENT ON COLUMN HANA_DUNDUN_USER_MISSION.completed_at IS '미션 완료 일시';

ALTER TABLE HANA_DUNDUN_USER_MISSION ADD CONSTRAINT fk_mission_user
    FOREIGN KEY (user_id) REFERENCES HANA_DUNDUN_USER(user_id);
ALTER TABLE HANA_DUNDUN_USER_MISSION ADD CONSTRAINT chk_mission_is_completed
    CHECK (is_completed IN ('Y', 'N'));
ALTER TABLE HANA_DUNDUN_USER_MISSION ADD CONSTRAINT chk_mission_reward
    CHECK (reward >= 0);


COMMIT;


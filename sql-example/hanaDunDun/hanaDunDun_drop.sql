-- =====================================================
-- 테이블, 시퀀스, 트리거 삭제 스크립트 (오류 출력 포함)
-- =====================================================

SET SERVEROUTPUT ON;

-- =====================================================
-- 1. 테이블 삭제 (CASCADE CONSTRAINTS 포함 + 오류 메시지 출력)
-- =====================================================
BEGIN
    FOR tbl_name IN (
        SELECT column_value AS table_name FROM TABLE(SYS.ODCIVARCHAR2LIST(
            'HANA_DUNDUN_POINT_HISTORY', 'HANA_DUNDUN_QUIZ_RESULT', 'HANA_DUNDUN_QUIZ', 'HANA_DUNDUN_TERM',
            'HANA_DUNDUN_INSTITUTION_MAPPING', 'HANA_DUNDUN_INSURANCE_DETAIL', 'HANA_DUNDUN_PENSION_DETAIL',
            'HANA_DUNDUN_ACCOUNT_TRANSACTION', 'HANA_DUNDUN_ACCOUNT_DETAIL', 'HANA_DUNDUN_ASSET',
            'HANA_DUNDUN_ASSET_CATEGORY_MAPPING', 'HANA_DUNDUN_REFRESH_TOKEN', 'HANA_DUNDUN_USER_ASSET_HISTORY',
            'HANA_DUNDUN_ALERT_SETTING', 'HANA_DUNDUN_ERROR_LOG', 'HANA_DUNDUN_AUTH_LOG', 'HANA_DUNDUN_SMS_LOG', 'HANA_DUNDUN_USER',
            'HANA_DUNDUN_QUIZ_OPTION', 'HANA_DUNDUN_VOC'
        ))
    ) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ' || tbl_name.table_name || ' CASCADE CONSTRAINTS';
            DBMS_OUTPUT.PUT_LINE('✅ Table dropped: ' || tbl_name.table_name);
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('❌ Error dropping table ' || tbl_name.table_name || ': ' || SQLERRM);
        END;
    END LOOP;
END;
/

-- =====================================================
-- 2. 시퀀스 삭제 (오류 메시지 출력 포함)
-- =====================================================
BEGIN
    FOR seq_name IN (
        SELECT column_value AS sequence_name FROM TABLE(SYS.ODCIVARCHAR2LIST(
            'SEQ_USER_ID', 'SEQ_LOG_ID', 'SEQ_ERROR_ID', 'SEQ_ALERT_ID',
            'SEQ_HISTORY_ID', 'SEQ_TOKEN_ID', 'SEQ_ASSET_ID', 'SEQ_TXN_ID',
            'SEQ_PENSION_ID', 'SEQ_INSURANCE_ID', 'SEQ_TERM_ID',
            'SEQ_QUIZ_ID', 'SEQ_RESULT_ID', 'SEQ_POINT_HISTORY_ID', 'SEQ_QUIZ_OPTION_ID', 'SEQ_VOC_ID'
        ))
    ) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE ' || seq_name.sequence_name;
            DBMS_OUTPUT.PUT_LINE('✅ Sequence dropped: ' || seq_name.sequence_name);
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('❌ Error dropping sequence ' || seq_name.sequence_name || ': ' || SQLERRM);
        END;
    END LOOP;
END;
/

COMMIT;
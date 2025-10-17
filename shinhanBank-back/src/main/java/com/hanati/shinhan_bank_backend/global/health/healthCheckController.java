package com.hanati.shinhan_bank_backend.global.health;

import com.hanati.shinhan_bank_backend.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class healthCheckController {

    private final DataSource dataSource;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkStatus() {
        log.info("헬스체크 요청 - 서비스 상태 확인");
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("application", "신한은행 API");
        status.put("version", "1.0.0");

        log.info("헬스체크 응답 - 서비스 정상 동작 중");
        return ResponseEntity.ok(ApiResponse.success("서비스가 정상적으로 동작중입니다.", status));
    }

    @GetMapping("/db")
    public ResponseEntity<ApiResponse<String>> testDbConnection() {
        log.info("DB 연결 테스트 요청");
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                log.info("DB 연결 테스트 성공 - Oracle DB 정상");
                return ResponseEntity.ok(ApiResponse.success("Oracle " +
                        "DB 연결이" +
                        " " +
                        "정상입니다."));
            } else {
                log.warn("DB 연결 테스트 실패 - 연결이 유효하지 않음");
                return ResponseEntity.status(500)
                        .body(ApiResponse.error("DB 연결이 유효하지 않습니다."));
            }
        } catch (Exception e) {
            log.error("DB 연결 테스트 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("DB 연결 실패: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<String> simpleHealthCheck() {
        log.info("간단한 헬스체크 요청");
        return ResponseEntity.ok("OK");
    }
}
package com.hanati.db_life_backend.global.health;

import com.hanati.db_life_backend.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
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
public class HealthCheckController {

    private final DataSource dataSource;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("application", "교보생명 API");
        status.put("version", "1.0.0");

        return ResponseEntity.ok(ApiResponse.success("서비스가 정상적으로 동작중입니다.", status));
    }

    @GetMapping("/db")
    public ResponseEntity<ApiResponse<String>> testDbConnection() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                return ResponseEntity.ok(ApiResponse.success("Oracle " +
                        "DB 연결이 정상입니다."));
            } else {
                return ResponseEntity.status(500)
                        .body(ApiResponse.error("DB 연결이 유효하지 않습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("DB 연결 실패: " + e.getMessage()));
        }
    }
}
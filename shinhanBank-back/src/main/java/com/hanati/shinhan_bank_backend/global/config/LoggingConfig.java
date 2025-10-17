package com.hanati.shinhan_bank_backend.global.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
@Slf4j
public class LoggingConfig {

    @PostConstruct
    public void init() {
        File logDir = new File("logs");
        if (!logDir.exists()) {
            boolean created = logDir.mkdirs();
            if (created) {
                log.info("로그 디렉토리 생성 완료: {}", logDir.getAbsolutePath());
            } else {
                log.warn("로그 디렉토리 생성 실패: {}", logDir.getAbsolutePath());
            }
        } else {
            log.info("로그 디렉토리 이미 존재: {}", logDir.getAbsolutePath());
        }
        
        log.info("=== 신한은행 백엔드 API 서버 시작 ===");
        log.info("Profile: {}", System.getProperty("spring.profiles.active", "local"));
        log.info("Port: {}", System.getProperty("server.port", "8080"));
        log.info("Swagger UI: http://localhost:8080/swagger-ui.html");
        log.info("API Docs: http://localhost:8080/api-docs");
        log.info("========================================");
    }
} 
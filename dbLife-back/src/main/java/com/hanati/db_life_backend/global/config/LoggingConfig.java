package com.hanati.db_life_backend.global.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingConfig.class);
    
    public LoggingConfig() {
        logger.info("DB생명 백엔드 로깅 설정이 초기화되었습니다.");
    }
} 
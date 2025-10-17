package com.hanati.db_life_backend.global.health;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class SimpleHealthController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("간단한 헬스체크 요청 - /health");
        return ResponseEntity.ok("OK");
    }
} 
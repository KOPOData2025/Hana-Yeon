package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.service.UpbitWebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class UpbitWebSocketController {

    private final UpbitWebSocketService upbitWebSocketService;

    @MessageMapping("/upbit/subscribe")
    public void subscribe(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            @SuppressWarnings("unchecked")
            List<String> codes = (List<String>) payload.get("codes");
            
            if (codes == null || codes.isEmpty()) {
                log.warn("구독할 코드가 없습니다 - 세션: {}", sessionId);
                return;
            }
            
            log.info("업비트 구독 요청 - 세션: {}, 코드: {}", sessionId, codes);
            upbitWebSocketService.subscribe(sessionId, codes);
            
        } catch (Exception e) {
            log.error("업비트 구독 처리 중 오류: ", e);
        }
    }

    @MessageMapping("/upbit/unsubscribe")
    public void unsubscribe(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            @SuppressWarnings("unchecked")
            List<String> codes = (List<String>) payload.get("codes");
            
            if (codes == null || codes.isEmpty()) {
                log.warn("구독 해제할 코드가 없습니다 - 세션: {}", sessionId);
                return;
            }
            
            log.info("업비트 구독 해제 요청 - 세션: {}, 코드: {}", sessionId, codes);
            upbitWebSocketService.unsubscribe(sessionId, codes);
            
        } catch (Exception e) {
            log.error("업비트 구독 해제 처리 중 오류: ", e);
        }
    }
}
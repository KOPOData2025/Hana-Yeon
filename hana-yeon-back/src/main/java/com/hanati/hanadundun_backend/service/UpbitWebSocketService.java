package com.hanati.hanadundun_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpbitWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    
    private WebSocketClient upbitClient;
    private final Map<String, Set<String>> subscriptions = new ConcurrentHashMap<>();
    private final Map<String, Object> latestTickers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    private static final String UPBIT_WS_URL = "wss://api.upbit.com/websocket/v1";
    private static final String TOPIC_PREFIX = "/topic/upbit/ticker/";
    
    @PostConstruct
    public void init() {
        connectToUpbit();
    }
    
    @PreDestroy
    public void cleanup() {
        if (upbitClient != null && !upbitClient.isClosed()) {
            upbitClient.close();
        }
        scheduler.shutdown();
    }
    
    private void connectToUpbit() {
        try {
            URI serverUri = new URI(UPBIT_WS_URL);
            
            upbitClient = new WebSocketClient(serverUri) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    log.info("업비트 WebSocket 연결 성공 - Status: {}", handshake.getHttpStatus());
                }
                
                @Override
                public void onMessage(String message) {
                    try {
                        log.debug("업비트 텍스트 메시지 수신: {}", message.substring(0, Math.min(message.length(), 200)));
                        @SuppressWarnings("unchecked")
                        Map<String, Object> data = objectMapper.readValue(message, Map.class);
                        String type = (String) data.get("type");
                        
                        if ("ticker".equals(type)) {
                            String code = (String) data.get("code");
                            latestTickers.put(code, data);
                            
                            Set<String> sessionIds = subscriptions.get(code);
                            if (sessionIds != null && !sessionIds.isEmpty()) {
                                messagingTemplate.convertAndSend(TOPIC_PREFIX + code, data);
                            }
                        }
                    } catch (Exception e) {
                        log.error("업비트 메시지 처리 중 오류: ", e);
                    }
                }
                
                @Override
                public void onMessage(java.nio.ByteBuffer bytes) {
                    try {
                        // 바이너리 메시지를 문자열로 변환
                        String message = new String(bytes.array(), java.nio.charset.StandardCharsets.UTF_8);
                        
                        @SuppressWarnings("unchecked")
                        Map<String, Object> data = objectMapper.readValue(message, Map.class);
                        String type = (String) data.get("type");
                        
                        if ("ticker".equals(type)) {
                            String code = (String) data.get("code");
                            latestTickers.put(code, data);
                            
                            Set<String> sessionIds = subscriptions.get(code);
                            if (sessionIds != null && !sessionIds.isEmpty()) {
                                messagingTemplate.convertAndSend(TOPIC_PREFIX + code, data);
                            }
                        }
                    } catch (Exception e) {
                        log.error("업비트 바이너리 메시지 처리 중 오류: ", e);
                    }
                }
                
                @Override
                public void onClose(int code, String reason, boolean remote) {
                    log.warn("업비트 WebSocket 연결 종료: {} - {}", code, reason);
                    // 재연결 시도
                    scheduler.schedule(() -> reconnect(), 3, TimeUnit.SECONDS);
                }
                
                @Override
                public void onError(Exception ex) {
                    log.error("업비트 WebSocket 오류: ", ex);
                }
            };
            
            upbitClient.connect();
            
        } catch (Exception e) {
            log.error("업비트 WebSocket 연결 실패: ", e);
        }
    }
    
    private void reconnect() {
        try {
            if (upbitClient != null && !upbitClient.isClosed()) {
                upbitClient.close();
            }
            connectToUpbit();
            
            // 기존 구독 복원
            Set<String> allCodes = new HashSet<>(subscriptions.keySet());
            if (!allCodes.isEmpty()) {
                scheduler.schedule(() -> subscribeToUpbit(new ArrayList<>(allCodes)), 1, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            log.error("업비트 WebSocket 재연결 실패: ", e);
            scheduler.schedule(() -> reconnect(), 5, TimeUnit.SECONDS);
        }
    }
    
    public void subscribe(String sessionId, List<String> codes) {
        log.info("업비트 구독 요청 - 세션: {}, 코드: {}", sessionId, codes);
        
        List<String> newCodes = new ArrayList<>();
        
        for (String code : codes) {
            subscriptions.computeIfAbsent(code, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
            
            // 이미 캐시된 데이터가 있으면 즉시 전송
            Object cachedData = latestTickers.get(code);
            if (cachedData != null) {
                messagingTemplate.convertAndSend(TOPIC_PREFIX + code, cachedData);
            } else {
                newCodes.add(code);
            }
        }
        
        // 새로운 코드들만 업비트에 구독 요청
        if (!newCodes.isEmpty()) {
            subscribeToUpbit(newCodes);
        }
    }
    
    public void unsubscribe(String sessionId, List<String> codes) {
        log.info("업비트 구독 해제 요청 - 세션: {}, 코드: {}", sessionId, codes);
        
        for (String code : codes) {
            Set<String> sessionIds = subscriptions.get(code);
            if (sessionIds != null) {
                sessionIds.remove(sessionId);
                if (sessionIds.isEmpty()) {
                    subscriptions.remove(code);
                    latestTickers.remove(code);
                }
            }
        }
    }
    
    public void unsubscribeAll(String sessionId) {
        log.info("업비트 전체 구독 해제 - 세션: {}", sessionId);
        
        List<String> codesToRemove = new ArrayList<>();
        
        for (Map.Entry<String, Set<String>> entry : subscriptions.entrySet()) {
            Set<String> sessionIds = entry.getValue();
            sessionIds.remove(sessionId);
            
            if (sessionIds.isEmpty()) {
                codesToRemove.add(entry.getKey());
            }
        }
        
        for (String code : codesToRemove) {
            subscriptions.remove(code);
            latestTickers.remove(code);
        }
    }
    
    private void subscribeToUpbit(List<String> codes) {
        if (upbitClient == null) {
            log.warn("업비트 WebSocket 클라이언트가 null");
            return;
        }
        
        if (!upbitClient.isOpen()) {
            log.warn("업비트 WebSocket이 연결되지 않음 - 상태: {}", upbitClient.getReadyState());
            return;
        }
        
        try {
            String ticket = "ticker-" + System.currentTimeMillis();
            
            List<Map<String, Object>> request = Arrays.asList(
                Map.of("ticket", ticket),
                Map.of("type", "ticker", "codes", codes)
            );
            
            String requestJson = objectMapper.writeValueAsString(request);
            log.info("업비트 구독 요청 JSON: {}", requestJson);
            upbitClient.send(requestJson);
            
            log.info("업비트 구독 요청 전송 완료: {}", codes);
            
        } catch (Exception e) {
            log.error("업비트 구독 요청 실패: ", e);
        }
    }
}
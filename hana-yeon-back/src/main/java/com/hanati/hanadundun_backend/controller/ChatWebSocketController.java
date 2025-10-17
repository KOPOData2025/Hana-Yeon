package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.chat.ChatMessageDto;
import com.hanati.hanadundun_backend.dto.chat.ChatResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.AIService;
import com.hanati.hanadundun_backend.service.JwtService;
import com.hanati.hanadundun_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AIService aiService;
    private final JwtService jwtService;
    private final UserService userService;

    @MessageMapping("/chat")
    public void processMessage(ChatMessageDto chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            log.info("WebSocket 메시지 수신 - content: {}", chatMessage.getContent());

            String token = extractTokenFromCookie(headerAccessor);
            log.info("headerAccessor: {}", headerAccessor);

            if (token == null) {
                log.error("쿠키에 accessToken이 없습니다");
                messagingTemplate.convertAndSend("/topic/chat", 
                    ChatResponseDto.from("인증이 필요합니다. 다시 로그인해주세요."));
                return;
            }

            String userId = jwtService.getUserIdFromToken(token);

            User user = userService.findByUserId(Long.parseLong(userId));
            if (user == null) {
                log.error("존재하지 않는 사용자입니다 - userId: {}", userId);
                messagingTemplate.convertAndSend("/topic/chat", 
                    ChatResponseDto.from("존재하지 않는 사용자입니다."));
                return;
            }

            String userMessage = chatMessage.getContent();
            log.info("AI 응답 생성 시작 - 사용자: {}, 메시지: {}", user.getUserName(), userMessage);

            String aiResponse = aiService.generateChatResponse(user, userMessage);

            String userSpecificTopic = "/topic/chat";
            messagingTemplate.convertAndSend(userSpecificTopic, ChatResponseDto.from(aiResponse));
            
            log.info("AI 응답 전송 완료 - userId: {}", userId);

        } catch (Exception e) {
            log.error("WebSocket 메시지 처리 중 오류 발생", e);
            messagingTemplate.convertAndSend("/topic/chat", 
                ChatResponseDto.from("오류가 발생했습니다. 다시 시도해주세요."));
        }
    }

    private String extractTokenFromCookie(SimpMessageHeaderAccessor headerAccessor) {
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            Object token = sessionAttributes.get("accessToken");
            if (token != null) {
                log.info("세션 속성에서 accessToken 추출 성공");
                return token.toString();
            }
        }

        log.warn("세션 속성에서 accessToken을 찾을 수 없습니다");
        
        String cookieHeader = headerAccessor.getFirstNativeHeader("cookie");
        if (cookieHeader != null) {
            log.debug("쿠키 헤더: {}", cookieHeader);
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                String trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith("accessToken=")) {
                    String token = trimmedCookie.substring("accessToken=".length());
                    log.info("쿠키 헤더에서 accessToken 추출 성공");
                    return token;
                }
            }
        }

        return null;
    }

}
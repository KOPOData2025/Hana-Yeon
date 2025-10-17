package com.hanati.hanadundun_backend.config;

import com.hanati.hanadundun_backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {       

        final String jwt;
        final String userId;

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            log.warn("쿠키가 없습니다");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = getTokenFromCookies(cookies);
        if (jwt == null) {
            log.warn("accessToken 쿠키가 없습니다");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            log.info("JWT 토큰 추출 성공");
            
            userId = jwtService.getUserIdFromToken(jwt);
            log.info("토큰에서 사용자 ID 추출: {}", userId);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userId, null, new ArrayList<>()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("사용자 인증 완료: {}", userId);
            }
            
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("JWT 토큰 검증 실패: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }
    }

    private String getTokenFromCookies(Cookie[] cookies) {
        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
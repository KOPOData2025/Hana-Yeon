package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.user.LogInRequestDto;
import com.hanati.hanadundun_backend.dto.user.LogInResponseDto;
import com.hanati.hanadundun_backend.dto.user.SignUpRequestDto;
import com.hanati.hanadundun_backend.dto.user.SignUpResponseDto;
import com.hanati.hanadundun_backend.dto.user.GetUserResponseDto;
import com.hanati.hanadundun_backend.dto.user.GetUserMissionsResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.UserService;
import com.hanati.hanadundun_backend.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Arrays;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    private Environment env;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto<SignUpResponseDto>> signUp(
            @Valid @RequestBody SignUpRequestDto request,
            HttpServletResponse httpResponse) {
        try {
            log.info("회원가입 요청: {}", request.getUserName());

            SignUpResponseDto response = userService.signUp(request);

            boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");
            Cookie cookie = new Cookie("accessToken", response.getAccessToken());
            cookie.setHttpOnly(true); 
            cookie.setSecure(isProd);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 24시간
            httpResponse.addCookie(cookie);

            return ResponseEntity.ok(
                    ApiResponseDto.success("회원가입이 성공적으로 완료되었습니다.", response)
            );

        } catch (RuntimeException e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("회원가입 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponseDto.error(500, "서버 내부 오류가 발생했습니다.")
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<LogInResponseDto>> login(
            @Valid @RequestBody LogInRequestDto request,
            HttpServletResponse httpResponse) {
        try {
            log.info("로그인 요청: {}", request.getPhoneNo());
            LogInResponseDto response = userService.login(request.getPhoneNo(), request.getPin());
            

            boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");
            Cookie cookie = new Cookie("accessToken", response.getAccessToken());
            cookie.setHttpOnly(true); 
            cookie.setSecure(isProd);   
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 24시간
            httpResponse.addCookie(cookie);
            
            return ResponseEntity.ok(ApiResponseDto.success("로그인 성공", response));
        } catch (RuntimeException e) {
            log.error("로그인 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponseDto.error(e.getMessage())
            );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<GetUserResponseDto>> getMe(@CookieValue(value = "accessToken", required = false) String token) {
        try{
            log.info("내 정보 조회 요청");
            if (token == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "accessToken 쿠키가 없습니다.");
            }
            String userId = jwtService.getUserIdFromToken(token);
            User user = userService.findByUserId(Long.parseLong(userId));
            GetUserResponseDto response = GetUserResponseDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .phoneNo(user.getPhoneNo())
                .gender(user.getGender())
                .birthDate(user.getBirthDate())
                .userStatus(user.getUserStatus())
                .quizPoint(user.getQuizPoint())
                .build();
            return ResponseEntity.ok(ApiResponseDto.success("내 정보 조회 성공", response));
        } catch (RuntimeException e) {
            log.error("내 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("내 정보 조회 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                ApiResponseDto.error("서버 내부 오류가 발생했습니다.")
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Void>> logout(
            @CookieValue(value = "accessToken", required = false) String token,
            HttpServletResponse httpResponse) {
        try {
            log.info("로그아웃 요청");
            
            Cookie cookie = new Cookie("accessToken", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(Arrays.asList(env.getActiveProfiles()).contains("prod"));
            cookie.setPath("/");
            cookie.setMaxAge(0);
            httpResponse.addCookie(cookie);
            
            return ResponseEntity.ok(ApiResponseDto.success("로그아웃 성공", null));
        } catch (Exception e) {
            log.error("로그아웃 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                ApiResponseDto.error("서버 내부 오류가 발생했습니다.")
            );
        }
    }

    @GetMapping("/missions")
    public ResponseEntity<ApiResponseDto<GetUserMissionsResponseDto>> getUserMissions(
            @CookieValue(value = "accessToken", required = false) String token) {
        try {
            log.info("사용자 미션 조회 요청");
            if (token == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "accessToken 쿠키가 없습니다.");
            }
            String userId = jwtService.getUserIdFromToken(token);
            GetUserMissionsResponseDto response = userService.getUserMissions(Long.parseLong(userId));
            return ResponseEntity.ok(ApiResponseDto.success("사용자 미션 조회 성공", response));
        } catch (RuntimeException e) {
            log.error("사용자 미션 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("사용자 미션 조회 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                ApiResponseDto.error("서버 내부 오류가 발생했습니다.")
            );
        }
    }
}
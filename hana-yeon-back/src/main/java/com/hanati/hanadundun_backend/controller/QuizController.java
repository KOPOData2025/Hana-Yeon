package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.quiz.CheckQuizRequestDto;
import com.hanati.hanadundun_backend.dto.quiz.CheckQuizResponseDto;
import com.hanati.hanadundun_backend.dto.quiz.TodayQuizResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.service.QuizService;
import com.hanati.hanadundun_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Quiz", description = "퀴즈 관련 API")
public class QuizController {

    private final QuizService quizService;
    private final UserService userService;
    
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) authentication.getPrincipal();
    }

    @GetMapping("/today")
    @Operation(summary = "오늘의 퀴즈 조회", description = "오늘 날짜에 해당하는 퀴즈를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "퀴즈를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponseDto<TodayQuizResponseDto>> getTodayQuiz() {
        try {
            String userId = getAuthenticatedUserId();

            TodayQuizResponseDto response = quizService.getTodayQuiz(Long.valueOf(userId));

            return ResponseEntity.ok(
                    ApiResponseDto.success("오늘의 퀴즈를 성공적으로 조회했습니다.", response)
            );

        } catch (RuntimeException e) {
            log.error("오늘의 퀴즈 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("오늘의 퀴즈 조회 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponseDto.error(500, "서버 내부 오류가 발생했습니다.")
            );
        }
    }

    @PostMapping("/check")
    @Operation(summary = "퀴즈 정답 확인", description = "사용자가 선택한 답안을 확인하고 포인트를 적립합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<ApiResponseDto<CheckQuizResponseDto>> checkQuizAnswer(
            @RequestBody CheckQuizRequestDto request) {
        try {
            String userId = getAuthenticatedUserId();
            User user = userService.findByUserId(Long.valueOf(userId));

            CheckQuizResponseDto response = quizService.checkQuizAnswer(user.getUserId(), request);

            return ResponseEntity.ok(
                    ApiResponseDto.success("퀴즈 답안을 성공적으로 확인했습니다.", response)
            );

        } catch (RuntimeException e) {
            log.error("퀴즈 답안 확인 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.error(e.getMessage())
            );
        } catch (Exception e) {
            log.error("퀴즈 답안 확인 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponseDto.error(500, "서버 내부 오류가 발생했습니다.")
            );
        }
    }
}
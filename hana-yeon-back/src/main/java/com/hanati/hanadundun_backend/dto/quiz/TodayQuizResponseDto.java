package com.hanati.hanadundun_backend.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TodayQuizResponseDto {
    private Long quizId;
    private String question;
    private List<QuizOptionDto> options;
    private Boolean isAlreadyAnswered;
    private String selectedAnswer; // 이미 답변한 경우 선택한 답
    private Boolean wasCorrect; // 이미 답변한 경우 정답 여부
}
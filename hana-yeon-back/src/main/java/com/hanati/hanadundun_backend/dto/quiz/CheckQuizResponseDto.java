package com.hanati.hanadundun_backend.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckQuizResponseDto {
    private Boolean isCorrect;
    private String correctAnswer;
    private String explanation;
    private Integer earnedPoint;
    private Integer totalQuizPoint;
}
package com.hanati.hanadundun_backend.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizOptionDto {
    private Long optionId;
    private String optionText;
}
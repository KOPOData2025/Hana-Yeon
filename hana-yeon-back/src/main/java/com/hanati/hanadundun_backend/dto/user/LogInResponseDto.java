package com.hanati.hanadundun_backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogInResponseDto {
    private String accessToken;
    private Long userId;
    private String userName;
}
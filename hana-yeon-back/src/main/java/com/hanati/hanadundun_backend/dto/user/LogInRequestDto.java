package com.hanati.hanadundun_backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LogInRequestDto {

    @NotBlank(message = "전화번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]{8,9}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNo;

    @NotBlank(message = "PIN은 필수입니다")
    @Pattern(regexp = "^\\d{6}$", message = "PIN은 6자리 숫자여야 합니다")
    private String pin;
}
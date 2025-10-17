package com.hanati.hanadundun_backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignUpRequestDto {
    @NotBlank(message = "사용자 이름은 필수입니다")
    private String userName;
    
    @NotBlank(message = "전화번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]{8,9}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNo;
    
    @NotBlank(message = "성별은 필수입니다")
    @Pattern(regexp = "^[MF]$", message = "성별은 M 또는 F여야 합니다")
    private String gender;
    
    @NotBlank(message = "생년월일은 필수입니다")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "생년월일 형식이 올바르지 않습니다 (YYYY-MM-DD)")
    private String birthDate;
    
    @NotBlank(message = "CI값은 필수입니다")
    private String userCi;
    
    @NotBlank(message = "PIN은 필수입니다")
    @Pattern(regexp = "^\\d{6}$", message = "PIN은 6자리 숫자여야 합니다")
    private String pin;
}
package com.hanati.hanadundun_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDto<T> {
    private int status;
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponseDto<T> success(String message, T data) {
        return new ApiResponseDto<>(200, true, message, data);
    }
    
    public static <T> ApiResponseDto<T> success(String message) {
        return new ApiResponseDto<>(200, true, message, null);
    }
    
    public static <T> ApiResponseDto<T> error(int status, String message) {
        return new ApiResponseDto<>(status, false, message, null);
    }
    
    public static <T> ApiResponseDto<T> error(String message) {
        return new ApiResponseDto<>(400, false, message, null);
    }
}
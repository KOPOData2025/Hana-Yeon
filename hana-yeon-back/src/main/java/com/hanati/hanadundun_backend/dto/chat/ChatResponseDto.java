package com.hanati.hanadundun_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {
    private String sender;
    private String message;
    private boolean isMine;
    private List<String> options;

    public static ChatResponseDto from(String message) {
        return new ChatResponseDto("ai", message, false, null);
    }
}
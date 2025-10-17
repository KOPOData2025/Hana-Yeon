package com.hanati.hanadundun_backend.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDto {
    private String userId;
    private String content;
}
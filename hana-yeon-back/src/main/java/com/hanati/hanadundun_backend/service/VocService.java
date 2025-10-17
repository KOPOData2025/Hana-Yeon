package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.voc.VocRequestDto;
import com.hanati.hanadundun_backend.entity.Voc;
import com.hanati.hanadundun_backend.repository.VocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VocService {

    private final VocRepository vocRepository;

    @Transactional
    public void createVoc(Long userId, VocRequestDto vocRequestDto) {
        Voc voc = Voc.builder()
                .userId(userId)
                .content(vocRequestDto.getContent())
                .build();
        vocRepository.save(voc);
    }
}
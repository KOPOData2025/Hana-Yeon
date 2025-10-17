package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final UserRepository userRepository;

    @Transactional
    public void buyProduct(Long userId, int point) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        if (user.getQuizPoint() < point) {
            throw new RuntimeException("잔액이 부족합니다.");
        }

        user.setQuizPoint(user.getQuizPoint() - point);
        userRepository.save(user);
    }
}
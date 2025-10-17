package com.hanati.db_life_backend.domain.user.service;

import com.hanati.db_life_backend.domain.user.entity.User;
import com.hanati.db_life_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    
    public Optional<User> findByUserCi(String userCi) {
        return userRepository.findByUserCi(userCi);
    }
    
    public boolean existsByUserCi(String userCi) {
        return userRepository.existsByUserCi(userCi);
    }
    
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }
} 
package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.UpbitUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpbitUserRepository extends JpaRepository<UpbitUser, Long> {
    
    Optional<UpbitUser> findByUserId(Long userId);
    
    Optional<UpbitUser> findByUserIdAndIsActive(Long userId, String isActive);
    
    boolean existsByUserId(Long userId);
    
    boolean existsByUserIdAndIsActive(Long userId, String isActive);
}
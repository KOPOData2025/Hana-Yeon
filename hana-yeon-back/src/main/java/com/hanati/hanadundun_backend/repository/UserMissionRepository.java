package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.UserMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMissionRepository extends JpaRepository<UserMission, Long> {
    
    List<UserMission> findByUserId(Long userId);
    
    List<UserMission> findByUserIdOrderByCreatedAtDesc(Long userId);
}

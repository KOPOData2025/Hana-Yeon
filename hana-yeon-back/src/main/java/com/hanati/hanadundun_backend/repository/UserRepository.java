package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUserCi(String userCi);
   
    Optional<User> findByPhoneNo(String phoneNo);
    
    boolean existsByUserCi(String userCi);
    
    boolean existsByPhoneNo(String phoneNo);
}
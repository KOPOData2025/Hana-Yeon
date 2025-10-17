package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.AuthAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthAccessTokenRepository extends JpaRepository<AuthAccessToken, Long> {

    Optional<AuthAccessToken> findTopByOrderByAuthAccessTokenIdDesc();
}
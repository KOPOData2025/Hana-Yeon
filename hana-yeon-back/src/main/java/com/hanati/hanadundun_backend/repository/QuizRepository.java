package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.options WHERE q.quizId = :quizId")
    Optional<Quiz> findByIdWithOptions(@Param("quizId") Long quizId);
}
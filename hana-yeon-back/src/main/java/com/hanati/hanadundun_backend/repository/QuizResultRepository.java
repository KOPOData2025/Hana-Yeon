package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    
    @Query(value = "SELECT * FROM HANA_DUNDUN_QUIZ_RESULT qr WHERE qr.user_id = ?1 AND qr.quiz_id = ?2 AND TRUNC(qr.answered_at) = TRUNC(SYSDATE)", nativeQuery = true)
    Optional<QuizResult> findByUserIdAndQuizIdAndToday(@Param("userId") Long userId, @Param("quizId") Long quizId);
}
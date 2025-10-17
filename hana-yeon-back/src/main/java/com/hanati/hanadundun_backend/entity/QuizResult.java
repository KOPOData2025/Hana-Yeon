package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_QUIZ_RESULT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_result_id")
    @SequenceGenerator(name = "seq_result_id", sequenceName = "SEQ_RESULT_ID", allocationSize = 1)
    @Column(name = "RESULT_ID")
    private Long resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUIZ_ID", nullable = false)
    private Quiz quiz;

    @Column(name = "SELECTED_ANSWER", nullable = false, length = 4000)
    private String selectedAnswer;

    @Column(name = "IS_CORRECT", nullable = false, length = 1)
    private String isCorrect;

    @Column(name = "EARNED_POINT", nullable = false)
    private Integer earnedPoint;

    @CreatedDate
    @Column(name = "ANSWERED_AT", nullable = false, updatable = false)
    private LocalDateTime answeredAt;
}
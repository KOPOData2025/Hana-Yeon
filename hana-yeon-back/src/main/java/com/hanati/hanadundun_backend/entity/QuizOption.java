package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_QUIZ_OPTION")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class QuizOption {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_quiz_option_id")
    @SequenceGenerator(name = "seq_quiz_option_id", sequenceName = "SEQ_QUIZ_OPTION_ID", allocationSize = 1)
    @Column(name = "OPTION_ID")
    private Long optionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUIZ_ID", nullable = false)
    private Quiz quiz;

    @Column(name = "OPTION_TEXT", nullable = false, length = 1000)
    private String optionText;

    @Column(name = "IS_CORRECT", nullable = false, length = 1)
    private String isCorrect;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
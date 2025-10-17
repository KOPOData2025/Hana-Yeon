package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "HANA_DUNDUN_QUIZ")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_quiz_id")
    @SequenceGenerator(name = "seq_quiz_id", sequenceName = "SEQ_QUIZ_ID", allocationSize = 1)
    @Column(name = "QUIZ_ID")
    private Long quizId;

    @Column(name = "QUIZ_TEXT", nullable = false, length = 1000)
    private String quizText;

    @Column(name = "ANSWER", nullable = false, length = 1000)
    private String answer;

    @Column(name = "POINT", nullable = false)
    private Integer point;

    @Lob
    @Column(name = "EXPLANATION")
    private String explanation;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizOption> options;
}
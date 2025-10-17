package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "HANA_DUNDUN_VOC")
public class Voc {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_voc_id")
    @SequenceGenerator(name = "seq_voc_id", sequenceName = "SEQ_VOC_ID", allocationSize = 1)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Lob
    @Column(nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Voc(Long userId, String content) {
        this.userId = userId;
        this.content = content;
    }
}
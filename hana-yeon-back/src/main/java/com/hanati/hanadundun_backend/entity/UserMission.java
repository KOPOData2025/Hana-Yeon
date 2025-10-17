package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_USER_MISSION")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserMission {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_mission_id")
    @SequenceGenerator(name = "seq_mission_id", sequenceName = "SEQ_MISSION_ID", allocationSize = 1)
    @Column(name = "MISSION_ID")
    private Long missionId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "TITLE", nullable = false, length = 255)
    private String title;

    @Column(name = "REWARD", nullable = false)
    private Integer reward;

    @Column(name = "IS_COMPLETED", nullable = false, length = 1)
    private String isCompleted;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "COMPLETED_AT")
    private LocalDateTime completedAt;
}

package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_UPBIT_USER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UpbitUser {

    @Id
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "ACCESS_KEY", nullable = false, length = 500)
    private String accessKey;

    @Column(name = "SECRET_KEY", nullable = false, length = 500)
    private String secretKey;

    @Column(name = "IS_ACTIVE", nullable = false, length = 1)
    private String isActive = "Y";

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    // 활성 상태 확인 메서드
    public boolean isActive() {
        return "Y".equals(this.isActive);
    }

    // 활성 상태 설정 메서드
    public void setActive(boolean active) {
        this.isActive = active ? "Y" : "N";
    }
}
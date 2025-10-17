package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_ASSET")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_asset_id")
    @SequenceGenerator(name = "seq_asset_id", sequenceName = "SEQ_ASSET_ID", allocationSize = 1)
    @Column(name = "ASSET_ID")
    private Long assetId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "ASSET_TYPE", nullable = false, length = 50)
    private String assetType;

    @Column(name = "CATEGORY_CODE", nullable = false)
    private Long categoryCode;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 생성자
    public Asset(Long userId, String assetType, Long categoryCode) {
        this.userId = userId;
        this.assetType = assetType;
        this.categoryCode = categoryCode;
    }
}
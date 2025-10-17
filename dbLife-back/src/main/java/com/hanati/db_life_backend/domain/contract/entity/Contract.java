package com.hanati.db_life_backend.domain.contract.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "DB_LIFE_CONTRACT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Contract {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contract_seq")
    @SequenceGenerator(name = "contract_seq", sequenceName = "CONTRACT_SEQ", allocationSize = 1)
    @Column(name = "CONTRACT_ID", length = 20)
    private String contractId;
    
    @Column(name = "USER_CI", length = 88, nullable = false)
    private String userCi;
    
    @Column(name = "INSU_TYPE", length = 10, nullable = false)
    private String insuType;
    
    @Column(name = "INSU_STATUS", length = 30, nullable = false)
    private String insuStatus;
    
    @Column(name = "PRODUCT_NAME", length = 100, nullable = false)
    private String productName;
    
    @Column(name = "CONTRACT_START_DATE")
    private LocalDate contractStartDate;
    
    @Column(name = "CONTRACT_END_DATE")
    private LocalDate contractEndDate;
    
    @Column(name = "MONTHLY_PREMIUM")
    private Integer monthlyPremium;
    
    @Column(name = "IS_ACTIVE", length = 1)
    private String isActive;
    
    @Column(name = "IS_TERMINATED", length = 1)
    private String isTerminated;
    
    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
} 
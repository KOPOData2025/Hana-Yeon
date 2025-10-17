package com.hanati.hanabank_backend.domain.irp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "HANABANK_IRP_ACCOUNT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IrpAccount {
    
    @Id
    @Column(name = "IRP_ID", length = 36, nullable = false)
    private String irpId;
    
    @Column(name = "ACCOUNT_ID", length = 255, nullable = false)
    private String accountId;
    
    @Column(name = "TOTAL_EVALUATION_AMOUNT", precision = 15, scale = 2)
    private BigDecimal totalEvaluationAmount;
    
    @Column(name = "YIELD_RATE", precision = 5, scale = 2)
    private BigDecimal yieldRate;
    
    @Column(name = "MATURITY_DATE")
    private LocalDate maturityDate;
    
    @Column(name = "WITHDRAWAL_LIMIT_YN", length = 1)
    private String withdrawalLimitYn;
    
    @Column(name = "IRP_TYPE", length = 20)
    private String irpType;
    
    @Column(name = "IRP_STATUS", length = 20)
    private String irpStatus;
    
    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
} 
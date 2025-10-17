package com.hanati.open_banking_backend.domain.bank.entity;

import com.hanati.open_banking_backend.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "OPENBANKING_BANK_CODE")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankCode extends BaseEntity {
    
    @Id
    @Column(name = "bank_code_std", length = 3)
    private String bankCodeStd;
    
    @Column(name = "bank_name", length = 50)
    private String bankName;
    
    @Column(name = "bank_type", length = 10)
    private String bankType;
} 
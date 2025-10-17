package com.hanati.shinhan_bank_backend.domain.transaction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shinhan_bank_transaction")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    
    @Id
    @Column(name = "tran_id", nullable = false, length = 50)
    private String tranId;
    
    @Column(name = "account_id", nullable = false)
    private Long accountId;
    
    @Column(name = "tran_date", nullable = false)
    private LocalDate tranDate;
    
    @Column(name = "tran_time", nullable = false, length = 6)
    private String tranTime;
    
    @Column(name = "inout_type", nullable = false, length = 8)
    private String inoutType;
    
    @Column(name = "tran_type", length = 10)
    private String tranType;
    
    @Column(name = "print_content", length = 20)
    private String printContent;
    
    @Column(name = "tran_amt", nullable = false, precision = 12, scale = 0)
    private BigDecimal tranAmt;
    
    @Column(name = "after_balance_amt", precision = 13, scale = 0)
    private BigDecimal afterBalanceAmt;
    
    @Column(name = "branch_name", length = 20)
    private String branchName;
    
    @Column(name = "wd_bank_code_std", nullable = false, length = 3)
    private String wdBankCodeStd;
    
    @Column(name = "wd_account_num", nullable = false, length = 16)
    private String wdAccountNum;
    
    @Column(name = "req_client_name", nullable = false, length = 20)
    private String reqClientName;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 
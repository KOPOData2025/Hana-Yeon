package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_ACCOUNT_DETAIL")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AccountDetail {

    @Id
    @Column(name = "ACCOUNT_NUM", length = 100)
    private String accountNum;

    @Column(name = "ASSET_ID", nullable = false)
    private Long assetId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "INSTITUTION_CODE", nullable = false, length = 50)
    private String institutionCode;

    @Column(name = "ACCOUNT_TYPE", nullable = false, length = 50)
    private String accountType;

    @Column(name = "PRODUCT_NAME", length = 255)
    private String productName;


    @Column(name = "ACCOUNT_STATUS", length = 20)
    private String accountStatus;

    @Column(name = "ACCOUNT_ISSUE_DATE")
    private LocalDate accountIssueDate;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 생성자
    public AccountDetail(String accountNum, Long assetId, Long userId, String institutionCode, 
                        String accountType, String productName, 
                        String accountStatus, LocalDate accountIssueDate) {
        this.accountNum = accountNum;
        this.assetId = assetId;
        this.userId = userId;
        this.institutionCode = institutionCode;
        this.accountType = accountType;
        this.productName = productName;
        this.accountStatus = accountStatus;
        this.accountIssueDate = accountIssueDate;
    }
}
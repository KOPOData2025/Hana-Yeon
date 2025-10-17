package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "HANA_DUNDUN_INSURANCE_DETAIL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_insurance_id")
    @SequenceGenerator(name = "seq_insurance_id", sequenceName = "SEQ_INSURANCE_ID", allocationSize = 1)
    @Column(name = "INSURANCE_ID")
    private Long insuranceId;

    @Column(name = "ASSET_ID")
    private Long assetId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "INSTITUTION_CODE", nullable = false, length = 50)
    private String institutionCode;

    @Column(name = "PRODUCT_NAME", length = 255)
    private String productName;

    @Column(name = "INSU_TYPE", length = 50)
    private String insuType;

    @Column(name = "INSU_STATUS", length = 20)
    private String insuStatus;

    @Column(name = "PREMIUM", precision = 18, scale = 0)
    private BigDecimal premium;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "EXPIRATION_DATE")
    private LocalDate expirationDate;

    // 생성자
    public InsuranceDetail(Long assetId, Long userId, String institutionCode, String productName, 
                          String insuType, String insuStatus, BigDecimal premium, 
                          LocalDate startDate, LocalDate expirationDate) {
        this.assetId = assetId;
        this.userId = userId;
        this.institutionCode = institutionCode;
        this.productName = productName;
        this.insuType = insuType;
        this.insuStatus = insuStatus;
        this.premium = premium;
        this.startDate = startDate;
        this.expirationDate = expirationDate;
    }
}
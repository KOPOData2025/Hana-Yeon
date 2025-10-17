package com.hanati.db_life_backend.domain.insurance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DB_LIFE_INSURANCE_CODE_MAPPING")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceCodeMapping {
    
    @Id
    @Column(name = "INSU_TYPE", length = 2)
    private String insuType;
    
    @Column(name = "NAME", length = 50, nullable = false)
    private String name;
} 
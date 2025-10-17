package com.hanati.db_life_backend.domain.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DB_LIFE_PRODUCT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @Column(name = "INSU_TYPE", length = 2)
    private String insuType;
    
    @Column(name = "NAME", length = 50, nullable = false)
    private String name;
    
    @Column(name = "INSU_CODE", length = 10)
    private String insuCode;
} 
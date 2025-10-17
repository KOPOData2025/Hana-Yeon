package com.hanati.db_life_backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "DB_LIFE_USER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @Column(name = "USER_CI", length = 88)
    private String userCi;
    
    @Column(name = "USER_INFO", length = 8, nullable = false)
    private String userInfo;
    
    @Column(name = "PHONE_NUMBER", length = 20, nullable = false)
    private String phoneNumber;
    
    @Column(name = "EMAIL", length = 100)
    private String email;
    
    @Column(name = "USERNAME", length = 100, nullable = false)
    private String username;
    
    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
} 
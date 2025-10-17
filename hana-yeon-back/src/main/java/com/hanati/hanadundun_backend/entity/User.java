package com.hanati.hanadundun_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "HANA_DUNDUN_USER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_user_id")
    @SequenceGenerator(name = "seq_user_id", sequenceName = "SEQ_USER_ID", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "USER_CI", nullable = false, unique = true, length = 255)
    private String userCi;

    @Column(name = "USER_NAME", nullable = false, length = 255)
    private String userName;

    @Column(name = "PHONE_NO", nullable = false, unique = true, length = 20)
    private String phoneNo;

    @Column(name = "GENDER", nullable = false, length = 10)
    private String gender;

    @Column(name = "BIRTH_DATE", length = 10)
    private String birthDate;

    @Column(name = "USER_PIN_HASHED", nullable = false, length = 255)
    private String userPinHashed;

    @Column(name = "USER_STATUS", nullable = false, length = 20)
    private String userStatus;

    @Column(name = "QUIZ_POINT", nullable = false)
    private Integer quizPoint;

    @Column(name = "INVEST_TYPE", length = 20)
    private String investType;

    @CreatedDate
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
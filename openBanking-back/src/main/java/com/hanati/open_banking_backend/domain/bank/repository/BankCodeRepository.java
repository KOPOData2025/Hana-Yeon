package com.hanati.open_banking_backend.domain.bank.repository;

import com.hanati.open_banking_backend.domain.bank.entity.BankCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankCodeRepository extends JpaRepository<BankCode, String> {
} 
package com.hanati.open_banking_backend.domain.account.repository;

import com.hanati.open_banking_backend.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByAccountNumAndBankCode_BankCodeStd(String accountNum, String bankCodeStd);
} 
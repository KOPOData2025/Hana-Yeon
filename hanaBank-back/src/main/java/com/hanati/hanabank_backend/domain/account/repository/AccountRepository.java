package com.hanati.hanabank_backend.domain.account.repository;

import com.hanati.hanabank_backend.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUserId(String userId);

    Optional<Account> findByUserIdAndAccountNum(String userId, String accountNum);

    Optional<Account> findByAccountNum(String accountNum);

    @Modifying
    @Query("UPDATE Account a SET a.balanceAmt = :newBalance WHERE a.accountId = :accountId")
    int updateAccountBalance(@Param("accountId") Long accountId, @Param("newBalance") BigDecimal newBalance);
}
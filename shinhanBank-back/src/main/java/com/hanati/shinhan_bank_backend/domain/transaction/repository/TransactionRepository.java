package com.hanati.shinhan_bank_backend.domain.transaction.repository;

import com.hanati.shinhan_bank_backend.domain.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    
    // 계좌 ID로 거래내역 조회
    List<Transaction> findByAccountId(Long accountId);
    
    // 계좌 ID와 거래일자로 거래내역 조회
    List<Transaction> findByAccountIdAndTranDate(Long accountId, LocalDate tranDate);
    
    // 계좌 ID와 거래일자 범위로 거래내역 조회
    List<Transaction> findByAccountIdAndTranDateBetween(Long accountId, LocalDate startDate, LocalDate endDate);
    
    // 계좌 ID와 입출금 구분으로 거래내역 조회
    List<Transaction> findByAccountIdAndInoutType(Long accountId, String inoutType);
    
    // 계좌번호로 거래내역 조회
    List<Transaction> findByWdAccountNum(String wdAccountNum);
    
    // 계좌번호와 거래일자로 거래내역 조회
    List<Transaction> findByWdAccountNumAndTranDate(String wdAccountNum, LocalDate tranDate);
    
    // 계좌번호와 거래일자 범위로 거래내역 조회
    List<Transaction> findByWdAccountNumAndTranDateBetween(String wdAccountNum, LocalDate startDate, LocalDate endDate);
    
    // 입출금 구분으로 거래내역 조회
    List<Transaction> findByWdAccountNumAndInoutType(String wdAccountNum, String inoutType);

    List<Transaction> findByAccountIdOrderByTranDateDescTranTimeDesc(Long accountId);

    List<Transaction> findByAccountIdOrderByTranDateAscTranTimeAsc(Long accountId);
} 
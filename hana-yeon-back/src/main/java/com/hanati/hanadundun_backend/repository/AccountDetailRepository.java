package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.AccountDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountDetailRepository extends JpaRepository<AccountDetail, String> {
    
    List<AccountDetail> findByUserId(Long userId);

    Optional<AccountDetail> findByAccountNumAndUserId(String accountNum, Long userId);
    
    boolean existsByAccountNum(String accountNum);
    
    List<AccountDetail> findByUserIdAndInstitutionCode(Long userId, String institutionCode);
}
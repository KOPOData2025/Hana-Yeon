package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.InsuranceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceDetailRepository extends JpaRepository<InsuranceDetail, Long> {
    
    List<InsuranceDetail> findByUserId(Long userId);
    
    List<InsuranceDetail> findByUserIdAndInstitutionCode(Long userId, String institutionCode);
    
    @Query("SELECT i FROM InsuranceDetail i WHERE i.userId = :userId AND i.institutionCode = :institutionCode AND i.productName = :productName")
    List<InsuranceDetail> findByUserIdAndInstitutionCodeAndProductName(
        @Param("userId") Long userId, 
        @Param("institutionCode") String institutionCode, 
        @Param("productName") String productName
    );
}
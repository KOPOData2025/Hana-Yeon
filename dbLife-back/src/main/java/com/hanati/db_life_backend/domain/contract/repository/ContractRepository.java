package com.hanati.db_life_backend.domain.contract.repository;

import com.hanati.db_life_backend.domain.contract.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    
    List<Contract> findByUserCi(String userCi);
    
    List<Contract> findByUserCiAndIsActive(String userCi, String isActive);
} 
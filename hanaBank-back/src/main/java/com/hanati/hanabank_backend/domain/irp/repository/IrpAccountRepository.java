package com.hanati.hanabank_backend.domain.irp.repository;

import com.hanati.hanabank_backend.domain.irp.entity.IrpAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IrpAccountRepository extends JpaRepository<IrpAccount, String> {
    List<IrpAccount> findByIrpType(String irpType);
    Optional<IrpAccount> findByIrpId(String irpId);
    List<IrpAccount> findByAccountId(String accountId);

}
package com.hanati.hanabank_backend.domain.irp.repository;

import com.hanati.hanabank_backend.domain.irp.entity.IrpInvestmentProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IrpInvestmentProductRepository extends JpaRepository<IrpInvestmentProduct, String> {
    List<IrpInvestmentProduct> findByIrpId(String irpId);
    Optional<IrpInvestmentProduct> findByProductId(String productId);
    List<IrpInvestmentProduct> findByProductName(String productName);
    List<IrpInvestmentProduct> findByBankCodeStd(String bankCodeStd);
}
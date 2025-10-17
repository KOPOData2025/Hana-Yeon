package com.hanati.db_life_backend.domain.product.repository;

import com.hanati.db_life_backend.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    Optional<Product> findByInsuType(String insuType);
} 
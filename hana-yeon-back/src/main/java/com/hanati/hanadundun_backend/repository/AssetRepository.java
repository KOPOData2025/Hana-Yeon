package com.hanati.hanadundun_backend.repository;

import com.hanati.hanadundun_backend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    
    List<Asset> findByUserId(Long userId);
    
    List<Asset> findByUserIdAndAssetType(Long userId, String assetType);
    
    boolean existsByUserIdAndAssetType(Long userId, String assetType);
}
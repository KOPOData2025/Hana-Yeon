package com.hanati.db_life_backend.domain.contract.controller;

import com.hanati.db_life_backend.domain.contract.dto.ContractListResponse;
import com.hanati.db_life_backend.domain.contract.dto.ContractSearchRequest;
import com.hanati.db_life_backend.domain.contract.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {
    
    private final ContractService contractService;
    
    @PostMapping("/all")
    public ResponseEntity<ContractListResponse> getAllContractsByUserCi(@RequestBody ContractSearchRequest request) {
        ContractListResponse response = contractService.getContractsByUserCi(request.getUserCi());
        
        if (response.getStatus() == 404) {
            return ResponseEntity.status(404).body(response);
        }
        
        return ResponseEntity.ok(response);
    }
} 
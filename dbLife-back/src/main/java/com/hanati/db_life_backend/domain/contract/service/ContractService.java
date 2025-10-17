package com.hanati.db_life_backend.domain.contract.service;

import com.hanati.db_life_backend.domain.contract.dto.ContractListResponse;
import com.hanati.db_life_backend.domain.contract.dto.ContractResponse;
import com.hanati.db_life_backend.domain.contract.entity.Contract;
import com.hanati.db_life_backend.domain.contract.repository.ContractRepository;
import com.hanati.db_life_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContractService {
    
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    public ContractListResponse getContractsByUserCi(String userCi) {
        // 사용자 존재 확인
        if (!userRepository.existsByUserCi(userCi)) {
            return ContractListResponse.builder()
                    .status(404)
                    .success(false)
                    .message("사용자 정보를 찾을 수 없습니다.")
                    .insuCnt(0)
                    .data(List.of())
                    .build();
        }
        
        // 사용자의 계약 목록 조회
        List<Contract> contracts = contractRepository.findByUserCi(userCi);
        
        // Contract 엔티티를 ContractResponse DTO로 변환
        List<ContractResponse> contractResponses = contracts.stream()
                .map(this::convertToContractResponse)
                .collect(Collectors.toList());
        
        return ContractListResponse.builder()
                .status(200)
                .success(true)
                .message("보험 조회 성공")
                .insuCnt(contractResponses.size())
                .data(contractResponses)
                .build();
    }
    
    private ContractResponse convertToContractResponse(Contract contract) {
        return ContractResponse.builder()
                .insuNum(contract.getContractId())
                .productName(contract.getProductName())
                .insuType(contract.getInsuType())
                .insuStatus(contract.getInsuStatus())
                .bankCode("436") // 교보생명 은행 코드 고정
                .insuranceCompany("DB생명")
                .issueDate(contract.getContractStartDate() != null ? 
                          contract.getContractStartDate().format(DATE_FORMATTER) : null)
                .expDate(contract.getContractEndDate() != null ? 
                        contract.getContractEndDate().format(DATE_FORMATTER) : null)
                .monthlyPremium(contract.getMonthlyPremium())
                .build();
    }
} 
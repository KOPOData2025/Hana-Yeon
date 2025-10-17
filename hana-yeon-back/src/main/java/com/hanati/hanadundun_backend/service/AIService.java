package com.hanati.hanadundun_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanati.hanadundun_backend.dto.asset.PortfolioRecommendationResponseDto;
import com.hanati.hanadundun_backend.dto.asset.analysis.PortfolioAnalysis;
import com.hanati.hanadundun_backend.entity.Asset;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.repository.AssetRepository;
import com.hanati.hanadundun_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openbanking.base-url:http://localhost:8081}")
    private String openBankingBaseUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;


    public PortfolioRecommendationResponseDto generatePortfolioRecommendation(String userId) {
        try {
            log.info("포트폴리오 분석 시작 - 사용자 ID: {}", userId);
            
            User user = userRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            // 1. 사용자 자산 데이터 수집
            PortfolioRecommendationResponseDto.UserAssetSummary assetSummary = collectUserAssetData(user.getUserId());
            
            // 2. 응답 생성
            String geminiResponse = callGeminiAPI(user, assetSummary);
            
            // 3. 응답
            return processGeminiResponse(geminiResponse, user, assetSummary);
            
        } catch (Exception e) {
            log.error("포트폴리오 분석 실패 - 사용자 ID: {}", userId, e);
            throw new RuntimeException("포트폴리오 분석 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    

    private PortfolioRecommendationResponseDto.UserAssetSummary collectUserAssetData(Long userId) {
        log.info("사용자 자산 데이터 수집 시작 - 사용자 ID: {}", userId);
        
        List<Asset> assets = assetRepository.findByUserId(userId);
        
        // category_code 기반으로 계좌 개수 계산
        int accountCount = (int) assets.stream()
                .filter(a -> a.getCategoryCode() == 1L || a.getCategoryCode() == 2L || a.getCategoryCode() == 3L)
                .count();
        
        // category_code 기반으로 보험 개수 계산
        int insuranceCount = (int) assets.stream()
                .filter(a -> a.getCategoryCode() == 8L || a.getCategoryCode() == 9L || 
                           a.getCategoryCode() == 10L || a.getCategoryCode() == 11L || a.getCategoryCode() == 15L)
                .count();
        
        List<PortfolioRecommendationResponseDto.AssetCategoryInfo> categoryBreakdown = createCategoryBreakdown(assets);
        
        // 절세 계좌별 개수 계산
        int isaCount = (int) assets.stream().filter(a -> a.getCategoryCode() == 14L).count();
        int irpCount = (int) assets.stream().filter(a -> a.getCategoryCode() == 4L).count();
        
        // 개인연금(연금저축) 계산
        int personalPensionCount = (int) assets.stream()
                .filter(a -> a.getCategoryCode() == 5L || a.getCategoryCode() == 6L || a.getCategoryCode() == 7L)
                .count();
        
        // 보험 종류별 정보 수집
        List<String> insuranceTypes = assets.stream()
                .filter(a -> a.getCategoryCode() == 8L || a.getCategoryCode() == 9L || 
                           a.getCategoryCode() == 10L || a.getCategoryCode() == 11L || a.getCategoryCode() == 15L)
                .map(a -> getCategoryName(a.getCategoryCode()))
                .distinct()
                .collect(java.util.stream.Collectors.toList());
        
        log.info("계좌 개수: {}, 보험 개수: {}, 개인연금: {}", accountCount, insuranceCount, personalPensionCount);
        log.info("보험 종류: {}", insuranceTypes);
        log.info("전체 자산 목록:");
        assets.forEach(asset -> log.info("  - categoryCode: {} ({}), assetType: {}", 
                asset.getCategoryCode(), getCategoryName(asset.getCategoryCode()), asset.getAssetType()));
        
        return PortfolioRecommendationResponseDto.UserAssetSummary.builder()
                .totalAssetCount(assets.size())
                .accountCount(accountCount)
                .insuranceCount(insuranceCount)
                .pensionCount(personalPensionCount)
                .isaCount(isaCount)
                .irpCount(irpCount)
                .personalPensionCount(personalPensionCount)
                .insuranceTypes(insuranceTypes)
                .categoryBreakdown(categoryBreakdown)
                .bankBreakdown(new ArrayList<>())
                .build();
    }
    

    private List<PortfolioRecommendationResponseDto.AssetCategoryInfo> createCategoryBreakdown(List<Asset> assets) {
        Map<String, PortfolioRecommendationResponseDto.AssetCategoryInfo> categoryMap = new HashMap<>();
        
        for (Asset asset : assets) {
            String categoryName = getCategoryName(asset.getCategoryCode());
            String assetType = asset.getAssetType();
            
            categoryMap.computeIfAbsent(categoryName, k -> 
                PortfolioRecommendationResponseDto.AssetCategoryInfo.builder()
                    .categoryName(categoryName)
                    .assetType(assetType)
                    .count(0)
                    .productNames(new ArrayList<>()) 
                    .build()
            ).setCount(categoryMap.get(categoryName).getCount() + 1);
        }
        
        return new ArrayList<>(categoryMap.values());
    }
    
    

    private String callGeminiAPI(User user, PortfolioRecommendationResponseDto.UserAssetSummary assetData) {
        try {
            log.info("Gemini API 호출 시작");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", geminiApiKey);
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", buildGeminiPrompt(user, assetData))
                    ))
                )
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                geminiApiUrl, HttpMethod.POST, entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return extractGeminiResponse(response.getBody());
            
        } catch (Exception e) {
            log.error("Gemini API 호출 실패", e);
            return "{\"error\": \"AI 분석 서비스에 일시적인 문제가 발생했습니다.\"}";
        }
    }


    private String buildGeminiPrompt(User user, PortfolioRecommendationResponseDto.UserAssetSummary assetData) {
        int ISAcnt = countAccountsByType(assetData, "ISA");
        int IRPcnt = countAccountsByType(assetData, "IRP");
        int PersonalPensionCnt = countAccountsByType(assetData, "PENSION");
        
        int userAge = calculateAge(user.getBirthDate());

        return """
                **SYSTEM:**
                당신은 하나금융그룹의 자산관리 서비스 '하나연(緣)'의 최고 수준의 AI 금융 컨설턴트입니다.
                사용자의 자산 데이터를 분석하여, '절세 계좌(ISA, IRP, 연금저축)'를 중심으로 한 최적의 포트폴리오 개선안을 제공해야 합니다.
                당신의 응답은 사용자가 즉시 하나금융그룹의 상품에 가입하고 싶게 만들 만큼 전문적이고 설득력 있어야 합니다.

                **출력 형식 (매우 중요):**
                - 반드시 단일 JSON 객체로만 응답해야 합니다.
                - JSON 앞뒤에 '```json', '```' 같은 마크다운 문법이나 다른 텍스트를 절대로 포함하지 마세요.
                - 모든 텍스트는 완벽하고 자연스러운 한국어로 작성해야 합니다.

                **절대 금지 (엄격히 준수):**
                - 'HanaDunDUn', 'recommendation' 등 의미 없는 영어를 절대 사용하지 마세요.
                - 분석 결과와 관련 없는 서론이나 끝맺음 말을 추가하지 마세요.

                **JSON 구조:**
                {
                  "title": "String (사용자의 눈길을 끄는 핵심 메시지)",
                  "summary": "String (현재 포트폴리오에 대한 총평)",
                  "improvementPoints": ["String", "String", "String", "String (개선이 필요한 점 4가지)"],
                  "customSolutions": [
                    {"title": "String (솔루션 제목)", "description": "String (구체적인 해결 방안 설명)"}
                  ],
                  "executionRoadmap": {
                    "immediate": ["String (즉시 실행할 액션)"],
                    "threeMonths": ["String (3개월 내 실행할 액션)"],
                    "longTerm": ["String (장기적 관점의 액션)"]
                  }
                }

                **핵심 분석 시나리오 (아래 로직을 반드시 따르세요):**
                %s

                **투자 포트폴리오 분석:**
                - 분석 내용: %s

                **보험 포트폴리오 분석:**
                - 보험 분석: %s
                - **필수 강조:** 보험 관련 개선점이 있다면 사용자의 나이를 설명한 후 어떤 보험이 부족한지 보험명을 말하고, **하나생명** 상품을 부족한 보험을 메울 것을 제안해야 합니다.

                **사용자 자산 현황 (분석 기반 데이터):**
                %s

                **최종 검토:**
                - 생성된 JSON이 유효한지, 불필요한 문자가 없는지 마지막으로 확인 후 응답하세요.
                """.formatted(
                generateCoreAssetAnalysis(ISAcnt, IRPcnt, PersonalPensionCnt),
                generateInvestmentAnalysis(hasAssetType(assetData, "STOCK")),
                generateInsuranceAnalysis(userAge, assetData),
                formatAssetDataForPrompt(assetData)
        );
    }


    private String generateCoreAssetAnalysis(int ISAcnt, int IRPcnt, int PersonalPensionCnt) {
        
        boolean hasISA = ISAcnt > 0;
        boolean hasIRP = IRPcnt > 0;
        boolean hasPensionSavings = PersonalPensionCnt > 0;
        
        // 유동성 확보를 위한 최적 연금저축 계좌 수 (2개 이상)
        boolean hasOptimalPensionSavingsCount = PersonalPensionCnt >= 2;

        List<String> analysisMessages = new ArrayList<>();
        List<String> recommendationMessages = new ArrayList<>();
        
        // 2-1. 세액공제 계좌 부재
        if (!hasIRP && !hasPensionSavings) {
            analysisMessages.add("연말정산 **세액공제 계좌 (IRP 또는 연금저축)**가 없어 연간 최대 **900만 원** 한도의 환급 혜택을 놓치고 있어요");
            recommendationMessages.add("- **세액공제 확보:** 하나은행 IRP 또는 연금저축 계좌를 개설하여 매년 **최대 148.5만 원**을 돌려받으세요.");
        }

        // 2-2. IRP 계좌만 보유
        if (hasIRP && !hasPensionSavings) {
            analysisMessages.add("**IRP 계좌만 보유**하고 연금저축 계좌가 없어, 세제 혜택 한도 **900만 원**을 온전히 활용하지 못하고 있어요.");
            recommendationMessages.add("- **연금저축 계좌 개설:** 하나은행 연금저축을 추가로 개설하면 **IRP(300만 원) + 연금저축(600만 원)**으로 세액공제 한도를 **최대 900만 원**까지 늘릴 수 있습니다.");
        }

        // 2-3. ISA 부재
        if (!hasISA) {
            analysisMessages.add("비과세 **ISA 통장**이 부재하여 이자/배당 소득에 대한 비과세 혜택과 연금 전환 시 **추가 세액공제** 기회를 놓치고 있어요");
            recommendationMessages.add("- **즉시 ISA 개설:** 하나은행 ISA를 개설하여 **절세의 첫 단추**를 마련하세요.");
        }
        
        // 2-4. 연금저축 복수 계좌 전략 미비 - 임시제거
        // (세액공제 계좌가 최소 하나는 있다는 전제 하에 유동성 전략 추천)
        // if ((hasIRP || hasPensionSavings) && !hasOptimalPensionSavingsCount) {
        //      analysisMessages.add("연금저축 계좌가 1개 이하네요. 납입금액을 분리하여 **중도 인출 시 패널티 없는 유동성**을 확보하는 전략이 부족해요.");
        //      recommendationMessages.add("- **연금저축 추가 개설:** **하나은행에 연금저축 계좌를 하나 더** 개설하여 세액공제 받지 않은 금액을 관리함으로써 비상금처럼 활용할 수 있도록 대비하세요.");
        // }
        
        if (!analysisMessages.isEmpty()) {
            // 문제가 하나라도 있다면, 분석 결과와 개선 전략을 조합하여 반환
            String analysisText = String.join("\n   - ", analysisMessages);
            String recommendationText = String.join("\n", recommendationMessages);
            
            String summary;
            if (!hasISA && !hasIRP && !hasPensionSavings) {
                 summary = "고객님은 **절세 계좌**를 단 하나도 보유하지 않아, 자산 성장이 매우 아쉬워요.";
            } else {
                 summary = "자산 성장을 갖추는 과정에 있으나, 몇 가지 중요한 혜택과 **유동성 전략**이 아쉬워요.";
            }
            
            return String.format("""
               - **총평:**
                 - %s
               - **주요 문제점:**
                 - %s
               - **하나은행 솔루션:**
                 - %s
            """, summary, analysisText, recommendationText);

        } else {
            // 모든 핵심 계좌와 전략을 갖춘 경우
            return """
               - **매우 훌륭해요!** 고객님은 절세의 핵심인 ISA, IRP, 그리고 연금저축 복수 계좌 전략까지 완벽하게 활용하는 **최고 수준의 자산가**시군요!
               - **다음 단계 제안:**
                 1) **납입 한도 최대화:** 매년 ISA(연 2,000만 원)와 연금(연 1,800만 원)의 납입 한도를 모두 채워 절세 효과를 극대화하고 있는지 점검해 보세요.
                 2) **계좌별 역할 점검:** 세액공제 받은 금액과 비공제 금액이 각 계좌에서 의도대로 관리되고 있는지 정기적으로 확인하여, 필요 시 유연하게 자금을 활용할 수 있도록 관리해 주세요.
            """;
        }
    }


    private String generateInvestmentAnalysis(boolean hasStocks) {
        if (!hasStocks) {
            return "- 주식 미보유: \"안정적인 자산 외에 인플레이션을 방어하고 자산 성장을 가속화할 투자 자산이 부족합니다. 국내 우량주 또는 미국 대표지수 ETF에 소액부터 투자를 시작하여 자산 가치 상승의 기회를 잡으세요.\"";
        } else {
            return "- 주식 보유중: \"주식 투자를 통해 적극적인 자산 증식을 실천하고 계십니다. 다만, 특정 국가나 자산에 편중되어 있다면 글로벌 분산 투자를 통해 포트폴리오의 안정성을 높이는 것을 고려해 보세요.\"";
        }
    }


    private String generateInsuranceAnalysis(int userAge, PortfolioRecommendationResponseDto.UserAssetSummary assetData) {
        List<String> insuranceTypes = assetData.getInsuranceTypes();
        boolean hasInsurance = assetData.getInsuranceCount() > 0;
        
        // 나이대별 추천 보험
        String recommendedInsurance = getRecommendedInsuranceByAge(userAge, insuranceTypes);
        
        if (!hasInsurance) {
            return String.format("- 보험 미보유 (%d세): \"예상치 못한 질병이나 사고는 자산 형성에 큰 위협이 될 수 있습니다. %s\"", 
                    userAge, recommendedInsurance);
        } else {
            String insuranceTypeStr = String.join(", ", insuranceTypes);
            
            if (recommendedInsurance.isEmpty()) {
                return String.format("- 보험 보유중 (%d세, 보유: %s): \"나이대에 맞는 보험을 잘 갖추고 계십니다. 정기적으로 보장 내용을 점검하여 현재 상황에 맞게 유지하시면 좋습니다.\"",
                        userAge, insuranceTypeStr);
            } else {
                return String.format("- 보험 보유중 (%d세, 보유: %s): \"현재 %s를 보유하고 계시지만, **%s**이(가) 부족합니다. **하나생명**의 맞춤형 상품으로 보장 공백을 메우세요.\"",
                        userAge, insuranceTypeStr, insuranceTypeStr, recommendedInsurance);
            }
        }
    }
    

    private String getRecommendedInsuranceByAge(int age, List<String> currentInsurances) {
        boolean hasMedicalInsurance = currentInsurances.contains("실손의료보험");
        boolean hasLifetimeInsurance = currentInsurances.contains("종신보험");
        boolean hasMajorIllness = currentInsurances.contains("생명보험") || currentInsurances.contains("종신보험");
        
        List<String> missing = new ArrayList<>();
        
        if (age >= 20 && age < 30) {
            // 20~29세: 실손의료보험
            if (!hasMedicalInsurance) missing.add("실손의료보험");
            if (missing.isEmpty()) return "건강한 20대 기본 보장";
        } else if (age >= 30 && age < 40) {
            // 30~39세: 실손의료보험, 종신보험/3대질병
            if (!hasMedicalInsurance) missing.add("실손의료보험");
            if (!hasLifetimeInsurance) missing.add("가족을 위한 종신보험");
            if (missing.isEmpty()) return "3대 진단비(암, 뇌혈관, 심장), 혹시 자녀계획이 있다면 자녀보험";
        } else if (age >= 40 && age < 50) {
            // 40~49세: 3대 질병(암·뇌·심장) 진단비
            if (!hasMajorIllness) missing.add("3대 질병(암·뇌·심장) 진단비");
            if (missing.isEmpty()) return "튼튼한 40대 건강 보장";
        } else if (age >= 50 && age < 60) {
            // 50~59세: 3대 질병보험, 간병보험
            if (!hasMajorIllness) missing.add("3대 질병보험");
            missing.add("간병보험");
            if (missing.size() <= 1 && hasMajorIllness) return "은퇴 후 간병 준비";
        } else if (age >= 60) {
            // 60세 이상: 간병보험, 치매보험
            missing.add("간병보험");
            missing.add("치매보험");
            if (missing.size() <= 1 && hasMajorIllness) return "노후 의료비 및 간병 준비";
        }
        
        if (!missing.isEmpty()) {
            return String.join(", ", missing);
        }
        
        return "";
    }

    

    private boolean hasAssetType(PortfolioRecommendationResponseDto.UserAssetSummary assetData, String assetType) {
        return assetData.getCategoryBreakdown().stream()
                .anyMatch(category -> category.getAssetType() != null && 
                         category.getAssetType().toUpperCase().contains(assetType.toUpperCase()));
    }
    

    private int countAccountsByType(PortfolioRecommendationResponseDto.UserAssetSummary assetData, String accountType) {
        switch (accountType) {
            case "ISA":
                return assetData.getIsaCount();
            case "IRP":
                return assetData.getIrpCount();
            case "PENSION":
                return assetData.getPersonalPensionCount();
            default:
                return 0;
        }
    }
    

    private String formatAssetDataForPrompt(PortfolioRecommendationResponseDto.UserAssetSummary assetData) {
        StringBuilder sb = new StringBuilder();
        sb.append("Total Assets: ").append(assetData.getTotalAssetCount()).append("\n");
        sb.append("Accounts: ").append(assetData.getAccountCount()).append("\n");
        sb.append("Insurances: ").append(assetData.getInsuranceCount()).append("\n");
        sb.append("Pensions: ").append(assetData.getPensionCount()).append("\n\n");

        sb.append("Category Breakdown:\n");
        for (PortfolioRecommendationResponseDto.AssetCategoryInfo category : assetData.getCategoryBreakdown()) {
            sb.append("- ").append(category.getCategoryName())
              .append(" (").append(category.getAssetType()).append("): ")
              .append(category.getCount()).append("\n");
        }
        
        if (!assetData.getInsuranceTypes().isEmpty()) {
            sb.append("\n보유 보험 종류:\n");
            for (String insuranceType : assetData.getInsuranceTypes()) {
                sb.append("- ").append(insuranceType).append("\n");
            }
        }

        sb.append("\nBank Breakdown:\n");
        for (PortfolioRecommendationResponseDto.BankInfo bank : assetData.getBankBreakdown()) {
            sb.append("- ").append(bank.getBankName())
              .append(": ").append(bank.getAccountCount()).append(" accounts\n");
        }
        
        return sb.toString();
    }
    

    private String extractGeminiResponse(Map<String, Object> responseBody) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                if (content != null) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        return text.trim().replace("```json", "").replace("```", "").trim();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Gemini 응답 파싱 실패", e);
        }
        return "{\"error\": \"AI 분석 결과를 처리하는 중 오류가 발생했습니다.\"}";
    }
    

    private PortfolioRecommendationResponseDto processGeminiResponse(
            String geminiResponse, User user, PortfolioRecommendationResponseDto.UserAssetSummary assetSummary) {
        
        PortfolioAnalysis portfolioAnalysis;
        try {
            portfolioAnalysis = objectMapper.readValue(geminiResponse, PortfolioAnalysis.class);
        } catch (Exception e) {
            log.error("Gemini JSON 응답을 PortfolioAnalysis 객체로 파싱하는 데 실패했습니다.", e);
            portfolioAnalysis = PortfolioAnalysis.builder()
                    .title("⚠️ 분석 결과 로딩 실패")
                    .summary("AI 분석 결과를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
                    .build();
        }
        
        // 사용자 자산 현황에 따른 추천 상품 타입 결정
        List<String> recommendations = generateRecommendations(user, assetSummary);
        log.info("생성된 추천 상품: {}", recommendations);
        
        Map<String, Object> assetSummaryMap = new HashMap<>();
        assetSummaryMap.put("totalAssets", assetSummary.getTotalAssetCount());
        assetSummaryMap.put("accounts", assetSummary.getAccountCount());
        assetSummaryMap.put("insurances", assetSummary.getInsuranceCount());
        assetSummaryMap.put("pensions", assetSummary.getPensionCount());
        
        return PortfolioRecommendationResponseDto.builder()
                .portfolioAnalysis(portfolioAnalysis)
                .recommendations(recommendations)
                .assetSummary(assetSummaryMap)
                .build();
    }
    

    private List<String> generateRecommendations(User user, PortfolioRecommendationResponseDto.UserAssetSummary assetSummary) {
        List<String> recommendations = new ArrayList<>();
        
        log.info("자산 현황 - ISA: {}, IRP: {}, 개인연금: {}", 
                assetSummary.getIsaCount(), assetSummary.getIrpCount(), assetSummary.getPersonalPensionCount());
        
        // ISA가 없는 경우 추천
        if (assetSummary.getIsaCount() == 0) {
            recommendations.add("isa");
            log.info("ISA 추천 추가");
        }
        
        // IRP가 없는 경우 추천
        if (assetSummary.getIrpCount() == 0) {
            recommendations.add("irp");
            log.info("IRP 추천 추가");
        }
        
        // 개인연금(연금저축)이 1개 이하인 경우 추천
        if (assetSummary.getPersonalPensionCount() <= 1) {
            recommendations.add("personalPension");
            log.info("개인연금 추천 추가 (현재 개수: {})", assetSummary.getPersonalPensionCount());
        }
        
        // 주식 투자가 없는 경우 추천
        boolean hasStock = assetSummary.getCategoryBreakdown().stream()
                .anyMatch(category -> "증권 계좌".equals(category.getCategoryName()) || 
                         (category.getAssetType() != null && category.getAssetType().toUpperCase().contains("STOCK")));
        if (!hasStock) {
            recommendations.add("stock");
        }
        
        // 나이에 따른 보험 추천
        int userAge = calculateAge(user.getBirthDate());
        List<String> insuranceTypes = assetSummary.getInsuranceTypes();
        
        // getRecommendedInsuranceByAge를 통해 추천 보험이 있는지 확인
        String recommendedInsuranceMsg = getRecommendedInsuranceByAge(userAge, insuranceTypes);
        if (!recommendedInsuranceMsg.isEmpty()) {
            recommendations.add("insurance");
            log.info("보험 추천 추가 ({}세, 추천: {})", userAge, recommendedInsuranceMsg);
        }
        
        return recommendations;
    }
    

    private int calculateAge(String birthDate) {
        try {
            if (birthDate == null || birthDate.length() < 8) {
                return 30; // 기본값
            }
            
            // birthDate 형식: YYYYMMDD 또는 YYYY-MM-DD
            String yearStr = birthDate.substring(0, 4);
            int birthYear = Integer.parseInt(yearStr);
            int currentYear = java.time.Year.now().getValue();
            
            return currentYear - birthYear;
        } catch (Exception e) {
            log.warn("나이 계산 실패 - birthDate: {}", birthDate, e);
            return 30;
        }
    }
    

    public String generateChatResponse(User user, String userMessage) {
        try {
            Long userId = user.getUserId();
            log.info("채팅 AI 응답 생성 시작 - 사용자 ID: {}, 메시지: {}", userId, userMessage);
            
            // 1. 사용자 자산 데이터 수집
            PortfolioRecommendationResponseDto.UserAssetSummary assetSummary = collectUserAssetData(userId);
            
            // 2. 응답 생성
            String geminiResponse = callGeminiChatAPI(user, assetSummary, userMessage);
            
            // 3. 응답
            return processChatGeminiResponse(geminiResponse);
            
        } catch (Exception e) {
            log.error("채팅 AI 응답 생성 실패 - 사용자 ID: {}, 메시지: {}", user.getUserId(), userMessage, e);
            return "죄송합니다. 일시적으로 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
    }
    

    private String callGeminiChatAPI(User user, PortfolioRecommendationResponseDto.UserAssetSummary assetData, String userMessage) {
        try {
            log.info("채팅용 Gemini API 호출 시작");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", geminiApiKey);
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", buildChatGeminiPrompt(user, assetData, userMessage))
                    ))
                )
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                geminiApiUrl, HttpMethod.POST, entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            return extractGeminiResponse(response.getBody());
            
        } catch (Exception e) {
            log.error("채팅용 Gemini API 호출 실패", e);
            return "죄송합니다. AI 분석 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
    }
    

    private String buildChatGeminiPrompt(User user, PortfolioRecommendationResponseDto.UserAssetSummary assetData, String userMessage) {
        // 사용자 정보
        String userName = user.getUserName();
        String userBirth = user.getBirthDate();
        String userGender = Objects.equals(user.getGender(), "M") ? "남자" : "여자";
        int userAge = calculateAge(user.getBirthDate());

        // 사용자 절세 계좌 보유 현황
        int ISAcnt = countAccountsByType(assetData, "ISA");
        int IRPcnt = countAccountsByType(assetData, "IRP");
        int PersonalPensionCnt = countAccountsByType(assetData, "PENSION");
        
        return """
                **SYSTEM:**
                당신은 하나금융그룹의 자산관리 서비스 '하나연(緣)'의 최고 수준의 AI 금융 컨설턴트 '하나챗봇' 입니다.
                사용자의 자산 데이터를 바탕으로 개인화된 금융 상담을 제공합니다.
                
                **중요한 지침:**
                - 반드시 완전한 한국어로만 응답하세요
                - 친근하고 전문적인 톤으로 상담해주세요
                - 사용자의 질문에 직접적으로 답변하되, 필요시 추가 조언을 포함하세요
                - 답변은 1-3문장으로 간결하게 작성하세요 (권장 50자, 최대 100자)
                - 사용자는 금융 질문 당연히 가능. 본인 개인정보 질문 가능. 하나연(緣) 앱 관련 질문 가능. 이 외의 경우, 아래 모든 정보를 무시하고 '저는 금융관련 답변만 할 수 있어요.' 라고 답하세요.
                - 이전 답변 문맥을 기억하되, 같은 정보의 대답은 다시할 필요 없습니다
                - 하나은행의 상품을 자연스럽게 추천할 수 있습니다
                - 마크다운, JSON 형식 등을 사용하지 말고 일반 텍스트로만 답변하세요
                
                **사용자 자산 현황:**
                %s
                
                **절세 계좌 보유 현황:**
                - ISA: %d개
                - IRP: %d개
                - 연금저축: %d개

                **투자 및 보험 분석:**
                - 투자 분석: %s
                - 보험 분석: %s
                
                **사용자 질문:**
                %s
                
                ** 사용자 이름, 생년월일 (나이), 성별:**
                %s %s %s
                
                **답변 요청:**
                위의 사용자 자산 현황을 고려하여 질문에 대해 개인화된 답변을 제공해주세요.
                """.formatted(
                formatAssetDataForPrompt(assetData),
                ISAcnt,
                IRPcnt, 
                PersonalPensionCnt,
                generateInvestmentAnalysis(hasAssetType(assetData, "STOCK")),
                generateInsuranceAnalysis(userAge, assetData),
                userMessage,
                userName,
                userBirth,
                userGender
        );
    }
    

    private String processChatGeminiResponse(String geminiResponse) {
        return geminiResponse.trim();
    }
    

    private String getCategoryName(Long categoryCode) {
        Map<Long, String> categoryMap = new HashMap<>();
        categoryMap.put(14L, "ISA");
        categoryMap.put(15L, "기타보험");
        categoryMap.put(1L, "입출금 계좌");
        categoryMap.put(2L, "정기예금·적금");
        categoryMap.put(3L, "증권 계좌");
        categoryMap.put(4L, "IRP (개인형 퇴직연금)");
        categoryMap.put(5L, "연금저축펀드");
        categoryMap.put(6L, "연금저축신탁");
        categoryMap.put(7L, "연금저축보험");
        categoryMap.put(8L, "생명보험");
        categoryMap.put(9L, "실손의료보험");
        categoryMap.put(10L, "종신보험");
        categoryMap.put(11L, "자동차보험");
        categoryMap.put(12L, "부동산");
        categoryMap.put(13L, "기타연금");
        
        return categoryMap.getOrDefault(categoryCode, "기타");
    }
}
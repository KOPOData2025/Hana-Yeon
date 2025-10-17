package com.hanati.hanadundun_backend.controller;

import com.hanati.hanadundun_backend.dto.ApiResponseDto;
import com.hanati.hanadundun_backend.dto.pension.PeerContributionResponseDto;
import com.hanati.hanadundun_backend.dto.pension.PensionBenchmarkResponseDto;
import com.hanati.hanadundun_backend.dto.pension.NationalPensionPredictionResponseDto;
import com.hanati.hanadundun_backend.service.PensionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.NoSuchElementException;


@Slf4j
@RestController
@RequestMapping("/api/pension")
@RequiredArgsConstructor
@Tag(name = "Pension API", description = "연금 관련 API")
public class PensionController {
    
    private final PensionService pensionService;


    /**
     * 동년배 평균 연금 데이터 조회 * 
     * @param age 사용자 나이 (필수)
     * @return 연금 벤치마크 데이터를 포함한 API 응답
     */
    @GetMapping("/predict-average")
    @Operation(
        summary = "동년배 평균 연금 조회", 
        description = "KOSIS Open API를 통해 사용자 나이에 해당하는 연령대의 연금 벤치마크 데이터를 조회합니다."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "벤치마크 데이터 조회 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 나이 입력"),
        @ApiResponse(responseCode = "404", description = "벤치마크 데이터 없음"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ApiResponseDto<PensionBenchmarkResponseDto>> getPeerAverage(
            @RequestParam("age") int age) {
        try {
            log.info("동년배 평균 연금 데이터 조회 요청 - 나이: {}", age);
            
            if (age < 20 || age > 100) {
                log.warn("유효하지 않은 나이: {}", age);
                ApiResponseDto<PensionBenchmarkResponseDto> errorResponse = 
                        ApiResponseDto.error(400, "나이는 20세 이상 100세 이하여야 합니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            PensionBenchmarkResponseDto benchmarkData = pensionService.getPeerAveragePension(age);
            
            // 데이터가 모두 0인 경우 (데이터 없음으로 간주)
            if (benchmarkData.getAverageTotalPension() == 0L && 
                benchmarkData.getNationalPension() == 0L && 
                benchmarkData.getRetirementPension() == 0L && 
                benchmarkData.getPersonalPension() == 0L) {
                
                log.warn("연금 수령 나이는 65세 이상이어야 합니다.");
                
                ApiResponseDto<PensionBenchmarkResponseDto> errorResponse = 
                        ApiResponseDto.error(404, "연금 수령 나이는 65세 이상이어야 합니다.");
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            log.info("동년배 평균 연금 데이터 조회 성공 - 나이: {}, 데이터: {}", age, benchmarkData);
            
            ApiResponseDto<PensionBenchmarkResponseDto> response = 
                    ApiResponseDto.success("동년배 평균 연금 데이터를 성공적으로 조회했습니다.", benchmarkData);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("연금 벤치마크 데이터 조회 중 비즈니스 로직 오류", e);
            
            ApiResponseDto<PensionBenchmarkResponseDto> errorResponse = 
                    ApiResponseDto.error(500, "연금 벤치마크 데이터 조회에 실패했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            
        } catch (Exception e) {
            log.error("연금 벤치마크 데이터 조회 중 예상치 못한 오류", e);
            
            ApiResponseDto<PensionBenchmarkResponseDto> errorResponse = 
                    ApiResponseDto.error(500, "서버 내부 오류가 발생했습니다.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 또래 월평균 연금 납부액 조회 (비동기)
     
    @GetMapping("/peer-monthly-average")
    @Operation(summary = "또래 월평균 연금 납부액 조회")
    public Mono<ResponseEntity<ApiResponseDto<PeerContributionResponseDto>>> getPeerContributionAverage(@RequestParam("age") int age) {
        return pensionService.getPeerContributionAverage(age)
                .map(dto ->
                        ApiResponseDto.success("사용자 또래 월평균 연금 납부액 조회에 성공했습니다.", dto)
                )
                .map(ResponseEntity::ok)
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponseDto.error(HttpStatus.BAD_REQUEST.value(), e.getMessage())))
                )
                .onErrorResume(NoSuchElementException.class, e ->
                        Mono.just(ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ApiResponseDto.error(HttpStatus.NOT_FOUND.value(), e.getMessage())))
                );
    }

    /**
     * 국민연금 예상 연금액 계산
     * @param monthlyContribution 국민연금 월 납부액
     * @return 가입 기간별 예상 연금액
     */
    @GetMapping("/predict-national-pension")
    @Operation(
        summary = "국민연금 예상 연금액 계산", 
        description = "사용자가 납부할 월 보험료를 기반으로 가입 기간별 국민연금 예상 연금액을 계산합니다."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "국민연금 예상 연금액 계산 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 월 보험료 입력"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ApiResponseDto<NationalPensionPredictionResponseDto>> predictNationalPension(
            @RequestParam("monthlyContribution") Long monthlyContribution) {
        try {
            log.info("국민연금 예상 연금액 계산 요청 - 월 보험료: {}원", monthlyContribution);
            
            if (monthlyContribution == null || monthlyContribution <= 0) {
                log.warn("유효하지 않은 월 보험료: {}", monthlyContribution);
                ApiResponseDto<NationalPensionPredictionResponseDto> errorResponse = 
                        ApiResponseDto.error(400, "월 보험료는 0원보다 커야 합니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (monthlyContribution > 10_000_000L) {
                log.warn("월 보험료가 너무 큼: {}원", monthlyContribution);
                ApiResponseDto<NationalPensionPredictionResponseDto> errorResponse = 
                        ApiResponseDto.error(400, "월 보험료는 1,000만원 이하여야 합니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            NationalPensionPredictionResponseDto predictionResult = pensionService.calculateNationalPension(monthlyContribution);
            
            log.info("국민연금 예상 연금액 계산 성공 - 월 보험료: {}원, 20년 기준 연금액: {}원", 
                    monthlyContribution, predictionResult.getPensionAmountsByPeriod().get(20));
            
            ApiResponseDto<NationalPensionPredictionResponseDto> response = 
                    ApiResponseDto.success("국민연금 예상 연금액을 성공적으로 계산했습니다.", predictionResult);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("국민연금 예상 연금액 계산 중 비즈니스 로직 오류", e);
            
            ApiResponseDto<NationalPensionPredictionResponseDto> errorResponse = 
                    ApiResponseDto.error(500, "국민연금 예상 연금액 계산에 실패했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            
        } catch (Exception e) {
            log.error("국민연금 예상 연금액 계산 중 예상치 못한 오류", e);
            
            ApiResponseDto<NationalPensionPredictionResponseDto> errorResponse = 
                    ApiResponseDto.error(500, "서버 내부 오류가 발생했습니다.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Object>> handleException(Exception e) {
        log.error("PensionController에서 처리되지 않은 예외 발생", e);
        ApiResponseDto<Object> errorResponse =
                ApiResponseDto.error(500, "요청 처리 중 오류가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
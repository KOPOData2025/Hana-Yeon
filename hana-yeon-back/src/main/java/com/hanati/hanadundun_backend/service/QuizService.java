package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.quiz.CheckQuizRequestDto;
import com.hanati.hanadundun_backend.dto.quiz.CheckQuizResponseDto;
import com.hanati.hanadundun_backend.dto.quiz.QuizOptionDto;
import com.hanati.hanadundun_backend.dto.quiz.TodayQuizResponseDto;
import com.hanati.hanadundun_backend.entity.Quiz;
import com.hanati.hanadundun_backend.entity.QuizOption;
import com.hanati.hanadundun_backend.entity.QuizResult;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.repository.QuizRepository;
import com.hanati.hanadundun_backend.repository.QuizResultRepository;
import com.hanati.hanadundun_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    /**
     * 오늘의 퀴즈 가져오기
     * quiz_id와 오늘 날짜의 일의자리를 조합하여 퀴즈 선택
     */
    @Transactional(readOnly = true)
    public TodayQuizResponseDto getTodayQuiz(Long userId) {
        // 오늘 날짜의 일의자리 구하기
        int dayOfMonth = LocalDate.now().getDayOfMonth();
        int lastDigit = dayOfMonth % 10;
        if (lastDigit == 0) lastDigit = 10; // 0이면 10으로 변경
        
        Long quizId = (long) lastDigit;
        
        Quiz quiz = quizRepository.findByIdWithOptions(quizId)
                .orElseThrow(() -> new RuntimeException("오늘의 퀴즈를 찾을 수 없습니다."));
        
        // 사용자가 오늘 이미 답변했는지 확인
        Optional<QuizResult> existingResult = quizResultRepository
                .findByUserIdAndQuizIdAndToday(userId, quizId);
        
        List<QuizOptionDto> optionDtos = new ArrayList<>();
        if (quiz.getOptions() != null && !quiz.getOptions().isEmpty()) {
            optionDtos = quiz.getOptions().stream()
                    .map(option -> new QuizOptionDto(
                            option.getOptionId(),
                            option.getOptionText()
                    ))
                    .collect(Collectors.toList());
        }
        
        TodayQuizResponseDto response = new TodayQuizResponseDto();
        response.setQuizId(quiz.getQuizId());
        response.setQuestion(quiz.getQuizText());
        response.setOptions(optionDtos);

        if (existingResult.isPresent()) {
            QuizResult result = existingResult.get();
            response.setIsAlreadyAnswered(true);
            response.setSelectedAnswer(result.getSelectedAnswer());
            response.setWasCorrect("Y".equals(result.getIsCorrect()));
        } else {
            response.setIsAlreadyAnswered(false);
        }
        
        return response;
    }

    //퀴즈 정답 확인 및 포인트 적립
    @Transactional
    public CheckQuizResponseDto checkQuizAnswer(Long userId, CheckQuizRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Quiz quiz = quizRepository.findByIdWithOptions(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));
        
        // 오늘 이미 답변했는지 확인
        Optional<QuizResult> existingResult = quizResultRepository
                .findByUserIdAndQuizIdAndToday(userId, request.getQuizId());
        
        if (existingResult.isPresent()) {
            throw new RuntimeException("오늘 이미 이 퀴즈에 답변하셨습니다.");
        }
        
        // 정답 확인
        QuizOption correctOption = quiz.getOptions().stream()
                .filter(option -> "Y".equals(option.getIsCorrect()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("정답을 찾을 수 없습니다."));
        
        boolean isCorrect = correctOption.getOptionText().equals(request.getSelectedAnswer());
        int earnedPoint = isCorrect ? quiz.getPoint() : 0;
        
        // 퀴즈 결과 저장
        QuizResult quizResult = new QuizResult();
        quizResult.setUser(user);
        quizResult.setQuiz(quiz);
        quizResult.setSelectedAnswer(request.getSelectedAnswer());
        quizResult.setIsCorrect(isCorrect ? "Y" : "N");
        quizResult.setEarnedPoint(earnedPoint);
        
        quizResultRepository.save(quizResult);
        
        // 정답인 경우 사용자 포인트 업데이트
        if (isCorrect) {
            user.setQuizPoint(user.getQuizPoint() + earnedPoint);
            userRepository.save(user);
        }
        
        CheckQuizResponseDto response = new CheckQuizResponseDto();
        response.setIsCorrect(isCorrect);
        response.setCorrectAnswer(correctOption.getOptionText());
        response.setExplanation(quiz.getExplanation());
        response.setEarnedPoint(earnedPoint);
        response.setTotalQuizPoint(user.getQuizPoint());
        
        return response;
    }
}
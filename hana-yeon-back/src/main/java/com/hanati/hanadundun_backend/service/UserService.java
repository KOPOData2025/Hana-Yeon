package com.hanati.hanadundun_backend.service;

import com.hanati.hanadundun_backend.dto.user.LogInResponseDto;
import com.hanati.hanadundun_backend.dto.user.SignUpRequestDto;
import com.hanati.hanadundun_backend.dto.user.SignUpResponseDto;
import com.hanati.hanadundun_backend.dto.user.GetUserMissionsResponseDto;
import com.hanati.hanadundun_backend.entity.User;
import com.hanati.hanadundun_backend.entity.UserMission;
import com.hanati.hanadundun_backend.repository.UserRepository;
import com.hanati.hanadundun_backend.repository.UserMissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMissionRepository userMissionRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    
    @Transactional
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        if (userRepository.existsByUserCi(request.getUserCi())) {
            throw new RuntimeException("이미 가입된 사용자입니다.");
        }
        
        if (userRepository.existsByPhoneNo(request.getPhoneNo())) {
            throw new RuntimeException("이미 사용중인 전화번호입니다.");
        }
        
        User user = new User();
        user.setUserName(request.getUserName());
        user.setPhoneNo(request.getPhoneNo());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setUserCi(request.getUserCi());
        user.setUserPinHashed(passwordEncoder.encode(request.getPin()));
        user.setUserStatus("ACTIVE");
        user.setQuizPoint(0);
        
        User savedUser = userRepository.save(user);
        
        String accessToken = jwtService.generateAccessToken(savedUser.getUserId().toString());
        
        return new SignUpResponseDto(accessToken);
    }
    
    public User findByUserCi(String userCi) {
        return userRepository.findByUserCi(userCi)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }
    
    public User findByUserId(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }
    
    public LogInResponseDto login(String phoneNo, String pin) {
        User user = userRepository.findByPhoneNo(phoneNo)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 전화번호입니다."));
        
        if (!passwordEncoder.matches(pin, user.getUserPinHashed())) {
            throw new RuntimeException("PIN이 일치하지 않습니다.");
        }
        
        if (!"ACTIVE".equals(user.getUserStatus())) {
            throw new RuntimeException("비활성화된 계정입니다.");
        }
        
        String accessToken = jwtService.generateAccessToken(user.getUserId().toString());
        
        return new LogInResponseDto(accessToken, user.getUserId(), user.getUserName());
    }
    
    @Transactional
    public void updateInvestType(Long userId, String investType) {
        if (!investType.equals("안정형") && !investType.equals("균형형") && !investType.equals("공격형")) {
            throw new RuntimeException("유효하지 않은 투자성향입니다. (안정형, 균형형, 공격형 중 선택)");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        
        user.setInvestType(investType);
        userRepository.save(user);
    }
    
    public GetUserMissionsResponseDto getUserMissions(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        
        List<UserMission> userMissions = userMissionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<GetUserMissionsResponseDto.Mission> missions = userMissions.stream()
                .map(GetUserMissionsResponseDto.Mission::from)
                .collect(Collectors.toList());
        
        return GetUserMissionsResponseDto.builder()
                .missions(missions)
                .build();
    }
}
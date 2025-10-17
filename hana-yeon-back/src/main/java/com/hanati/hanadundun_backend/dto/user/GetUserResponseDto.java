package com.hanati.hanadundun_backend.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetUserResponseDto {
  private Long userId;
  private String userCi;
  private String userName;
  private String phoneNo;
  private String gender;
  private String birthDate;
  private String userStatus;
  private Integer quizPoint;
}
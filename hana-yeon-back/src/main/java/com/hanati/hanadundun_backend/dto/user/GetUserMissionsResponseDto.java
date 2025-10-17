package com.hanati.hanadundun_backend.dto.user;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserMissionsResponseDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Mission {
        private Long id;
        private String title;
        private Integer reward;
        private Boolean isCompleted;

        public static Mission from(com.hanati.hanadundun_backend.entity.UserMission userMission) {
            return Mission.builder()
                    .id(userMission.getMissionId())
                    .title(userMission.getTitle())
                    .reward(userMission.getReward())
                    .isCompleted("Y".equals(userMission.getIsCompleted()))
                    .build();
        }
    }

    private java.util.List<Mission> missions;
}

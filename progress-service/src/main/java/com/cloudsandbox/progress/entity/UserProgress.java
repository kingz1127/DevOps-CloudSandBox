package com.cloudsandbox.progress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String exerciseId; // e.g., "EX-DOCKER-01"
    private Integer score;     // 0 to 100
    private String status;     // COMPLETED, FAILED

    private LocalDateTime completedAt;
}
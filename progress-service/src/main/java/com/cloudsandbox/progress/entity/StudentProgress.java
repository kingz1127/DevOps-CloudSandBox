package com.cloudsandbox.progress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StudentProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String moduleName; // e.g., "Docker Basics"
    private Integer score;
    private boolean completed;
    private LocalDateTime completionDate;
    private String relatedContainerId;
}
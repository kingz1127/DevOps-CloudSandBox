package com.cloudsandbox.progress.service;

import com.cloudsandbox.progress.entity.UserProgress;
import com.cloudsandbox.progress.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final UserProgressRepository repository;

    public UserProgress recordProgress(String userId, String exerciseId, Integer score) {
        UserProgress progress = UserProgress.builder()
                .userId(userId)
                .exerciseId(exerciseId)
                .score(score)
                .status(score >= 70 ? "COMPLETED" : "FAILED")
                .completedAt(LocalDateTime.now())
                .build();
        return repository.save(progress);
    }

    public List<UserProgress> getStudentReportCard(String userId) {
        return repository.findByUserId(userId);
    }
}
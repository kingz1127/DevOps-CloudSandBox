package com.cloudsandbox.progress.controller;

import com.cloudsandbox.progress.entity.UserProgress;
import com.cloudsandbox.progress.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;

    @PostMapping("/submit")
    public ResponseEntity<UserProgress> submitExercise(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String exerciseId,
            @RequestParam Integer score) {
        return ResponseEntity.ok(progressService.recordProgress(userId, exerciseId, score));
    }

    @GetMapping("/me")
    public ResponseEntity<List<UserProgress>> getMyProgress(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(progressService.getStudentReportCard(userId));
    }
}
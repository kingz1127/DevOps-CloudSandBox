package com.cloudsandbox.progress.controller;

import com.cloudsandbox.progress.entity.StudentProgress;
import com.cloudsandbox.progress.repository.StudentProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final StudentProgressRepository repository;

    @GetMapping("/me")
    public ResponseEntity<List<StudentProgress>> getMyProgress(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(repository.findByUserId(userId));
    }

    @PostMapping("/submit")
    public ResponseEntity<StudentProgress> submitScore(@RequestHeader("X-User-Id") String userId, @RequestBody StudentProgress progress) {
        progress.setUserId(userId);
        return ResponseEntity.ok(repository.save(progress));
    }
}
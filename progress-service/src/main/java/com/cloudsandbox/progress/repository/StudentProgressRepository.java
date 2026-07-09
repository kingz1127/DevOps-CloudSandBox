package com.cloudsandbox.progress.repository;

import com.cloudsandbox.progress.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

    List<StudentProgress> findByUserId(String userId);
}
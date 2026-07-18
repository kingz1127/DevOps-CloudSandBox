package com.cloudsandbox.progress.repository;

import com.cloudsandbox.progress.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

    List<StudentProgress> findByUserId(String userId);

    List<StudentProgress> findByUserIdAndRelatedContainerId(String userId, String relatedContainerId);

    // ADD THESE ANNOTATIONS
    @Modifying
    @Transactional
    void deleteByUserIdAndRelatedContainerId(String userId, String relatedContainerId);
}
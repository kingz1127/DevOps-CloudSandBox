package com.cloudsandbox.containersim.repository;

import com.cloudsandbox.containersim.entity.ContainerLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContainerLogRepository extends JpaRepository<ContainerLog, Long> {
    List<ContainerLog> findByContainerIdOrderByLoggedAtAsc(Long containerId);
}
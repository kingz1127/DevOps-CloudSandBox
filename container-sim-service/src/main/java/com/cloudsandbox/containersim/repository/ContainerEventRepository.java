package com.cloudsandbox.containersim.repository;

import com.cloudsandbox.containersim.entity.ContainerEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContainerEventRepository extends JpaRepository<ContainerEvent, Long> {
    List<ContainerEvent> findByContainerIdOrderByEventTimestampAsc(Long containerId);
}
package com.cloudsandbox.containersim.repository;

import com.cloudsandbox.containersim.entity.SimContainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SimContainerRepository extends JpaRepository<SimContainer, String> {
    List<SimContainer> findByUserId(String userId);

    Optional<SimContainer> findByContainerIdAndUserId(String containerId, String userId);
    Optional<SimContainer> findByIdAndUserId(String id, String userId);
}
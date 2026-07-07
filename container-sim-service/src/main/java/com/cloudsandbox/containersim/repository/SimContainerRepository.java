package com.cloudsandbox.containersim.repository;

import com.cloudsandbox.containersim.entity.SimContainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SimContainerRepository extends JpaRepository<SimContainer, String> {

    // Add this method to find containers owned by a specific user
    List<SimContainer> findByUserId(String userId);

    // Add this method to find a specific container for security/ownership validation
    Optional<SimContainer> findByIdAndUserId(String id, String userId);
}
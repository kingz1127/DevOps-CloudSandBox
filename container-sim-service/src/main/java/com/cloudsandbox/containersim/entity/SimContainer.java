package com.cloudsandbox.containersim.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sim_containers")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SimContainer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId; // From X-User-Id header

    private String name;
    private String imageName;
    private String containerId; // Mocked Docker ID (e.g., 7f8e9a12b3c4)
    private String internalIp;  // Mocked IP (e.g., 172.17.0.5)

    @Enumerated(EnumType.STRING)
    private ContainerStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
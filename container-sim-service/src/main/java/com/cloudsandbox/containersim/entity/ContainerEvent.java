package com.cloudsandbox.containersim.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "container_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "container_id", nullable = false)
    private Long containerId;

    @Column(name = "event_type", nullable = false, length = 30)
    private String eventType;   // CREATED | STARTED | PAUSED | RESUMED | STOPPED | REMOVED

    @Column(name = "event_timestamp", nullable = false)
    private LocalDateTime eventTimestamp;

    @Column(columnDefinition = "TEXT")
    private String details;

    @PrePersist
    void onCreate() {
        eventTimestamp = LocalDateTime.now();
    }
}

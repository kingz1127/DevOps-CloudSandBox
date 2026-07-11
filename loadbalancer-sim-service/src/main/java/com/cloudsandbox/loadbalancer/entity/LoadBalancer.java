package com.cloudsandbox.loadbalancer.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class LoadBalancer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String userId;
    private String name;
    private String algorithm; // e.g., "ROUND_ROBIN"
    private String publicIp;  // e.g., "1.2.3.4"

    @ElementCollection
    private List<String> targetContainerIps; // List of virtual IPs like 172.17.0.x
}
package com.cloudsandbox.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String passwordHash;

    @Column(name = "cohort_code") // Add this field
    private String cohortCode;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder.Default // Fixes the warning
    private boolean enabled = true;

    public String getUsername() { return username; }
}
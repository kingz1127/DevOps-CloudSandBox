package com.cloudsandbox.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank @Size(min = 4, max = 20)
    @Column(unique = true)
    private String username;

    @NotBlank @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @NotBlank
    private String passwordHash;

    @NotBlank(message = "Cohort code is required")
    private String cohortCode;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder.Default
    private boolean enabled = true;
}
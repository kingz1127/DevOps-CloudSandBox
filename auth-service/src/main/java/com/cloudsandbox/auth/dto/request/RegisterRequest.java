package com.cloudsandbox.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        String firstName,
        String lastName,
        String username,
        String email,
        String password,
        String cohortCode
) {}

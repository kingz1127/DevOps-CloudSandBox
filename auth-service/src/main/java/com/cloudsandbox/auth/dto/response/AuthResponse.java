package com.cloudsandbox.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        long expiresAt,
        String username,
        UserResponse user
) {}
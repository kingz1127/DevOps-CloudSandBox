package com.cloudsandbox.auth.controller;

import com.cloudsandbox.auth.dto.request.LoginRequest;
import com.cloudsandbox.auth.dto.request.RegisterRequest;
import com.cloudsandbox.auth.dto.response.AuthResponse;
import com.cloudsandbox.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Service", description = "Endpoints for User Registration and JWT Login")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user", description = "Creates a new user profile in the PostgreSQL database.")
    @ApiResponse(responseCode = "200", description = "User created successfully")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Login to Sandbox", description = "Authenticates user and returns a Bearer JWT Token.")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
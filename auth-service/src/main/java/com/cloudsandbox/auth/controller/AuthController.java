package com.cloudsandbox.auth.controller;

import com.cloudsandbox.auth.dto.request.ForgotPasswordRequest;
import com.cloudsandbox.auth.dto.request.LoginRequest;
import com.cloudsandbox.auth.dto.request.RegisterRequest;
import com.cloudsandbox.auth.dto.request.ResetPasswordRequest;
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
@Tag(name = "Authentication Service", description = "Endpoints for User Registration, Login, and Password Recovery")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Login to Sandbox")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Initiate Forgot Password", description = "Sends a reset link to the user's email via Brevo SMTP.")
    @ApiResponse(responseCode = "200", description = "Reset email sent successfully")
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.ok("Reset link sent to your email.");
    }

    @Operation(summary = "Reset Password", description = "Validates the token and updates the user's password.")
    @ApiResponse(responseCode = "200", description = "Password updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }
}

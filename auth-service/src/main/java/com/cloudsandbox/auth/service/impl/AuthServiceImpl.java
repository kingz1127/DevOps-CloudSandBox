
package com.cloudsandbox.auth.service.impl;

import com.cloudsandbox.auth.dto.request.*;
import com.cloudsandbox.auth.dto.response.*;
import com.cloudsandbox.auth.entity.*;
import com.cloudsandbox.auth.exception.*;
import com.cloudsandbox.auth.mapper.UserMapper;
import com.cloudsandbox.auth.repository.*;
import com.cloudsandbox.auth.security.JwtService;
import com.cloudsandbox.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .cohortCode(request.cohortCode())
                .role(Role.USER)
                .enabled(true)
                .build();

        User savedUser = userRepository.saveAndFlush(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);

        try {
            // Check if user exists
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("User not found with email: {}", email);
                        return new RuntimeException("User not found");
                    });

            // Delete existing tokens for this user
            tokenRepository.deleteByUserEmail(email);

            // Generate new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .userEmail(email)
                    .expiryDate(LocalDateTime.now().plusMinutes(15))
                    .build();

            tokenRepository.save(resetToken);
            log.info("Password reset token generated for user: {}", email);

            // Send email with reset link
            sendResetEmail(email, token);
            log.info("Reset email sent to: {}", email);

        } catch (Exception e) {
            log.error("Error in forgot password for email {}: {}", email, e.getMessage());
            // Re-throw the exception to be handled by controller
            throw new RuntimeException("Failed to process password reset request: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Processing password reset with token: {}", token);

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.warn("Invalid password reset token: {}", token);
                    return new InvalidTokenException("Invalid or expired reset link");
                });

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            log.warn("Expired password reset token: {}", token);
            tokenRepository.delete(resetToken);
            throw new InvalidTokenException("Reset link has expired");
        }

        User user = userRepository.findByEmail(resetToken.getUserEmail())
                .orElseThrow(() -> {
                    log.warn("User not found for reset token: {}", token);
                    return new RuntimeException("User not found");
                });

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password reset successful for user: {}", user.getEmail());

        // Delete used token
        tokenRepository.delete(resetToken);
    }

    private void sendResetEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("osunyingboadedeji1@gmail.com");
            message.setTo(email);
            message.setSubject("CloudSandbox - Password Reset Request");

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            log.info("Reset link for {}: {}", email, resetLink);

            message.setText("Hello,\n\nYou requested to reset your password. Click the link below to proceed:\n\n"
                    + resetLink + "\n\nThis link is valid for 15 minutes.\n\n"
                    + "If you didn't request this, please ignore this email.");

            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send reset email to {}: {}", email, e.getMessage());
            // Don't rethrow - we want to continue even if email fails
            // But we should log it properly
        }
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        return refresh(request.refreshToken());
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new InvalidTokenException("Unknown refresh token"));

        if (stored.isRevoked() || stored.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Refresh token expired or revoked");
        }

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> new InvalidTokenException("User no longer exists"));

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return buildAuthResponse(user);
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse changeRole(String userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        user.setRole(Role.valueOf(newRole.toUpperCase()));
        return userMapper.toResponse(userRepository.save(user));
    }

    private AuthResponse buildAuthResponse(User user) {
        String userId = user.getId() != null ? user.getId() : "";
        String username = user.getUsername() != null ? user.getUsername() : "unknown";
        String roleName = user.getRole() != null ? user.getRole().name() : "USER";

        String accessToken = jwtService.generateAccessToken(userId, username, roleName);
        String refreshTokenValue = generateOpaqueToken();

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(refreshTokenValue)
                .expiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        UserResponse manualUserResponse = new UserResponse(
                userId,
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getLastName() != null ? user.getLastName() : "",
                username,
                user.getEmail() != null ? user.getEmail() : "",
                user.getCohortCode() != null ? user.getCohortCode() : ""
        );

        return new AuthResponse(
                accessToken,
                refreshTokenValue,
                jwtService.getAccessTokenExpirationMs(),
                username,
                manualUserResponse
        );
    }

    private String generateOpaqueToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
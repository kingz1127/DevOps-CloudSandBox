package com.cloudsandbox.auth.service.impl;

import com.cloudsandbox.auth.dto.request.LoginRequest;
import com.cloudsandbox.auth.dto.request.RefreshRequest;
import com.cloudsandbox.auth.dto.request.RegisterRequest;
import com.cloudsandbox.auth.dto.response.AuthResponse;
import com.cloudsandbox.auth.dto.response.UserResponse;
import com.cloudsandbox.auth.entity.RefreshToken;
import com.cloudsandbox.auth.entity.Role;
import com.cloudsandbox.auth.entity.User;
import com.cloudsandbox.auth.exception.InvalidCredentialsException;
import com.cloudsandbox.auth.exception.InvalidTokenException;
import com.cloudsandbox.auth.mapper.UserMapper;
import com.cloudsandbox.auth.repository.RefreshTokenRepository;
import com.cloudsandbox.auth.repository.UserRepository;
import com.cloudsandbox.auth.security.JwtService;
import com.cloudsandbox.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor // Simplifies constructor injection
public class AuthServiceImpl implements AuthService {

    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
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

        // Pass the saved user that definitely contains the generated ID string
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

        // This will now work because stored.getUserId() returns a String
        // and userRepository.findById() expects a String
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
        // Safe null checks before generating the token properties
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
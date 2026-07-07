package com.cloudsandbox.auth.service;

import com.cloudsandbox.auth.dto.request.*;
import com.cloudsandbox.auth.dto.response.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshRequest request);
    AuthResponse refresh(String refreshToken);
    UserResponse getCurrentUser(String username);
    UserResponse changeRole(String userId, String newRole);
}
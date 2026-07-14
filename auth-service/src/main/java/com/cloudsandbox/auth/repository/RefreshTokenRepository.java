package com.cloudsandbox.auth.repository;

import com.cloudsandbox.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Used during the /refresh flow to find the token details
    Optional<RefreshToken> findByToken(String token);

    // FIX: Takes String userId to match the User UUID (id)
    // Used to clean up old tokens for a specific user
    void deleteByUserId(String userId);

    // Optional: Useful for checking if a user has active sessions
    Optional<RefreshToken> findByUserId(String userId);
}
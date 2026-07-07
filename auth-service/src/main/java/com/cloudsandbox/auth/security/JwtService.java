package com.cloudsandbox.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String username, String role) {
        return generateAccessToken(null, username, role);
    }

    public String generateAccessToken(String userId, String username, String role) {
        return Jwts.builder()
                // Using individual claims prevents Map.of() from throwing a NullPointerException
                .claim("role", role != null ? role : "USER")
                .claim("userId", userId != null ? userId : "")
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public long getAccessTokenExpirationMs() {
        return expiration; // return the expiration value from your @Value field
    }
    private Key getSigningKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Verifies that the token hasn't been tampered with
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
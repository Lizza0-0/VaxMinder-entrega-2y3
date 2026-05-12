package com.vaxminder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET     = "vaxminderSecretKey2025VaxminderSecretKey2025";
    private static final long   EXPIRATION = 86_400_000L; // 24h

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Para pacientes (idusuario numerico)
    public String generarToken(Integer idusuario) {
        return buildToken(String.valueOf(idusuario), "PACIENTE");
    }

    // Para centros medicos (NIT string)
    public String generarTokenCentro(String nit) {
        return buildToken(nit, "CENTRO");
    }

    private String buildToken(String subject, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String extraerSubject(String token) {
        return parsearClaims(token).getSubject();
    }

    // Extrae el NIT del subject de un token de centro
    public String extraerNit(String token) {
        try {
            Claims claims = parsearClaims(token);
            Object rol = claims.get("rol");
            if ("CENTRO".equals(rol)) {
                return claims.getSubject();
            }
            return null;
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public boolean validar(String token) {
        try {
            parsearClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parsearClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

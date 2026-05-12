package com.vaxminder.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utilidad para generar y validar JWT.
 *
 * Dependencia a agregar en pom.xml:
 * <dependency>
 *   <groupId>io.jsonwebtoken</groupId>
 *   <artifactId>jjwt-api</artifactId>
 *   <version>0.12.3</version>
 * </dependency>
 * <dependency>
 *   <groupId>io.jsonwebtoken</groupId>
 *   <artifactId>jjwt-impl</artifactId>
 *   <version>0.12.3</version>
 *   <scope>runtime</scope>
 * </dependency>
 * <dependency>
 *   <groupId>io.jsonwebtoken</groupId>
 *   <artifactId>jjwt-jackson</artifactId>
 *   <version>0.12.3</version>
 *   <scope>runtime</scope>
 * </dependency>
 */
@Component
public class JwtUtil {

    // Clave secreta desde application.properties (mínimo 32 caracteres)
    @Value("${jwt.secret}")
    private String secret;

    // Expiración: 24 horas en milisegundos
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000L;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Genera un JWT con la cédula del usuario como subject.
     */
    public String generarToken(String cedula) {
        return Jwts.builder()
                .subject(cedula)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey())
                .compact();
    }

    /**
     * Extrae la cédula del token.
     */
    public String extraerCedula(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Valida si el token es legítimo y no expiró.
     */
    public boolean esValido(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

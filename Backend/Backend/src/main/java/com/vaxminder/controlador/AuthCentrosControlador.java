package com.vaxminder.controlador;

import com.vaxminder.dto.CentroActualizarDTO;
import com.vaxminder.dto.CentroLoginDTO;
import com.vaxminder.dto.CentroRegistroDTO;
import com.vaxminder.dto.CentroResponseDTO;
import com.vaxminder.modelo.CentrosMedicosAuth;
import com.vaxminder.security.JwtUtil;
import com.vaxminder.servicio.CentrosMedicosAuthServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/centros")
public class AuthCentrosControlador {

    @Autowired private CentrosMedicosAuthServicio servicio;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody CentroRegistroDTO dto) {
        try {
            if (dto.getNit() == null || !dto.getNit().matches("\\d+"))
                return ResponseEntity.badRequest().body(Map.of("error", "El NIT debe contener solo digitos, sin guion ni digito de verificacion"));
            if (dto.getRazonsocial() == null || dto.getRazonsocial().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "La razon social es requerida"));
            if (dto.getDireccion() == null || dto.getDireccion().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "La direccion es requerida"));
            if (dto.getCiudad() == null || dto.getCiudad().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "La ciudad es requerida"));
            if (dto.getContrasena() == null || dto.getContrasena().length() < 6)
                return ResponseEntity.badRequest().body(Map.of("error", "La contrasena debe tener al menos 6 caracteres"));
            if (dto.getTelefono() != null && !dto.getTelefono().isBlank()) {
                if (!dto.getTelefono().matches("\\d{10}"))
                    return ResponseEntity.badRequest().body(Map.of("error", "El telefono debe tener exactamente 10 digitos"));
            }

            CentroResponseDTO centro = servicio.registrar(dto);
            String token = jwtUtil.generarTokenCentro(centro.getNit());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", token, "centro", centro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CentroLoginDTO dto) {
        Optional<CentrosMedicosAuth> opt = servicio.buscarEntidad(dto.getNit());
        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "NIT o contrasena incorrectos"));
        if (!servicio.verificarContrasena(dto.getContrasena(), opt.get().getContrasena()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "NIT o contrasena incorrectos"));
        String token = jwtUtil.generarTokenCentro(dto.getNit());
        return ResponseEntity.ok(Map.of("token", token, "centro", new CentroResponseDTO(opt.get())));
    }

    /**
     * PUT /api/auth/centros/perfil
     * Permite al centro autenticado actualizar razonsocial, direccion y telefono.
     * El NIT y la ciudad NO son modificables.
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CentroActualizarDTO dto) {
        try {
            // Extraer NIT del token JWT
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token requerido"));
            String token = authHeader.substring(7);
            String nit   = jwtUtil.extraerNit(token);
            if (nit == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token invalido"));

            // Validaciones
            if (dto.getRazonsocial() == null || dto.getRazonsocial().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "La razon social es requerida"));
            if (dto.getDireccion() == null || dto.getDireccion().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "La direccion es requerida"));
            if (dto.getTelefono() != null && !dto.getTelefono().isBlank()) {
                if (!dto.getTelefono().matches("\\d{10}"))
                    return ResponseEntity.badRequest().body(Map.of("error", "El telefono debe tener exactamente 10 digitos"));
            }

            CentroResponseDTO updated = servicio.actualizarPerfil(nit, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}

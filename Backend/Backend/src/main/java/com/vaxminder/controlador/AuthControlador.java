package com.vaxminder.controlador;

import com.vaxminder.dto.LoginDTO;
import com.vaxminder.dto.UsuarioRegistroDTO;
import com.vaxminder.dto.UsuarioResponseDTO;
import com.vaxminder.modelo.Usuarios;
import com.vaxminder.security.JwtUtil;
import com.vaxminder.servicio.UsuariosServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    @Autowired private UsuariosServicio servicio;
    @Autowired private JwtUtil          jwtUtil;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody UsuarioRegistroDTO dto) {
        try {
            UsuarioResponseDTO usuario = servicio.registrar(dto);
            String token = jwtUtil.generarToken(usuario.getIdusuario());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("token", token, "usuario", usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Optional<Usuarios> opt = servicio.buscarEntidad(dto.getIdusuario());
        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Cedula o contrasena incorrecta"));
        if (!servicio.verificarContrasena(dto.getContrasena(), opt.get().getContrasena()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Cedula o contrasena incorrecta"));
        String token = jwtUtil.generarToken(dto.getIdusuario());
        return ResponseEntity.ok(Map.of("token", token, "usuario", new UsuarioResponseDTO(opt.get())));
    }
}

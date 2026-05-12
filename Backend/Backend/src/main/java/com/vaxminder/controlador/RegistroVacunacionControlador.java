package com.vaxminder.controlador;

import com.vaxminder.dto.RegistroVacunacionDTO;
import com.vaxminder.modelo.RegistroVacunacion;
import com.vaxminder.servicio.RegistroVacunacionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrovacunacion")
public class RegistroVacunacionControlador {

    @Autowired private RegistroVacunacionServicio servicio;

    @GetMapping
    public ResponseEntity<List<RegistroVacunacion>> listarTodos() {
        return ResponseEntity.ok(servicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return servicio.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Registro no encontrado: " + id)));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<RegistroVacunacion>> buscarPorUsuario(@PathVariable Integer id) {
        return ResponseEntity.ok(servicio.buscarPorUsuario(id));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody RegistroVacunacionDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

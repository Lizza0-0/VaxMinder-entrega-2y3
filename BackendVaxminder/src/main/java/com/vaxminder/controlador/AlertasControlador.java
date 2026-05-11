package com.vaxminder.controlador;

import com.vaxminder.modelo.Alertas;
import com.vaxminder.servicio.AlertasServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertas")
public class AlertasControlador {

    @Autowired private AlertasServicio servicio;

    @GetMapping
    public ResponseEntity<List<Alertas>> listarTodos() {
        return ResponseEntity.ok(servicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return servicio.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Alerta no encontrada: " + id)));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Alertas>> buscarPorUsuario(@PathVariable String id) {
        return ResponseEntity.ok(servicio.buscarPorUsuario(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Alertas>> buscarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(servicio.buscarPorEstado(estado));
    }

    @GetMapping("/usuario/{id}/estado/{estado}")
    public ResponseEntity<List<Alertas>> buscarPorUsuarioYEstado(
            @PathVariable String id, @PathVariable String estado) {
        return ResponseEntity.ok(servicio.buscarPorUsuarioYEstado(id, estado));
    }

    @PostMapping
    public ResponseEntity<?> crear() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Las alertas son generadas automaticamente por el sistema"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Las alertas no pueden modificarse"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Las alertas no pueden eliminarse"));
    }
}

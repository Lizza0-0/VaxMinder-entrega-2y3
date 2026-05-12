package com.vaxminder.controlador;

import com.vaxminder.dto.HistorialPdfDTO;
import com.vaxminder.modelo.HistorialPdf;
import com.vaxminder.servicio.HistorialPdfServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historialpdf")
public class HistorialPdfControlador {

    @Autowired private HistorialPdfServicio servicio;

    @GetMapping
    public ResponseEntity<List<HistorialPdf>> listarTodos() {
        return ResponseEntity.ok(servicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return servicio.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Historial no encontrado: " + id)));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<HistorialPdf>> buscarPorUsuario(@PathVariable Integer id) {
        return ResponseEntity.ok(servicio.buscarPorUsuario(id));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody HistorialPdfDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "El historial PDF no puede modificarse"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "El historial PDF no puede eliminarse"));
    }
}

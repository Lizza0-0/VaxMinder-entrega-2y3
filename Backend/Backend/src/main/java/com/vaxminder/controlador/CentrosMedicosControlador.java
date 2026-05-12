package com.vaxminder.controlador;

import com.vaxminder.modelo.CentrosMedicos;
import com.vaxminder.servicio.CentrosMedicosServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/centrosmedicos")
public class CentrosMedicosControlador {

    @Autowired private CentrosMedicosServicio servicio;

    @GetMapping
    public ResponseEntity<List<CentrosMedicos>> listarTodos() {
        return ResponseEntity.ok(servicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return servicio.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Centro no encontrado: " + id)));
    }

    @GetMapping("/ciudad/{ciudad}")
    public ResponseEntity<List<CentrosMedicos>> buscarPorCiudad(@PathVariable String ciudad) {
        return ResponseEntity.ok(servicio.buscarPorCiudad(ciudad));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<CentrosMedicos>> buscarPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(servicio.buscarPorTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody CentrosMedicos centro) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(centro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Los centros medicos no pueden modificarse"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Los centros medicos no pueden eliminarse"));
    }
}

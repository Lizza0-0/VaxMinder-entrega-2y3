package com.vaxminder.controlador;

import com.vaxminder.modelo.Usuarios;
import com.vaxminder.modelo.VacunasCatalogo;
import com.vaxminder.repositorio.UsuariosRepositorio;
import com.vaxminder.servicio.VacunasCatalogoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vacunascatalogo")
public class VacunasCatalogoControlador {

    @Autowired private VacunasCatalogoServicio servicio;
    @Autowired private UsuariosRepositorio     usuariosRepo;

    @GetMapping
    public ResponseEntity<List<VacunasCatalogo>> listarTodos() {
        return ResponseEntity.ok(servicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return servicio.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Vacuna no encontrada: " + id)));
    }

    @GetMapping("/sugeridas/{idusuario}")
    public ResponseEntity<?> sugeridasPorEdad(@PathVariable String idusuario) {
        Usuarios u = usuariosRepo.findById(idusuario).orElse(null);
        if (u == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        long edadMeses = ChronoUnit.MONTHS.between(u.getFechanacimiento(), LocalDate.now());
        List<VacunasCatalogo> sugeridas = servicio.listarTodos().stream()
                .filter(v -> aplicaEdad(v.getEdadrecomendada(), edadMeses))
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("edadMeses", edadMeses, "vacunas", sugeridas));
    }

    private boolean aplicaEdad(Integer edadRecomendadaMeses, long edadUsuarioMeses) {
        if (edadRecomendadaMeses == null) return true;
        return edadUsuarioMeses >= edadRecomendadaMeses;
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody VacunasCatalogo vacuna) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(vacuna));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                        @RequestBody VacunasCatalogo vacuna) {
        try {
            return ResponseEntity.ok(servicio.actualizar(id, vacuna));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of("error", "Las vacunas del catalogo no pueden eliminarse"));
    }
}

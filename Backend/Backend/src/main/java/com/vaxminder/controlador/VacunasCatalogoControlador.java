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
import java.time.Period;
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
    public ResponseEntity<?> sugeridasPorEdad(@PathVariable Integer idusuario) {
        Usuarios u = usuariosRepo.findById(idusuario).orElse(null);
        if (u == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        int edad = Period.between(u.getFechanacimiento(), LocalDate.now()).getYears();
        List<VacunasCatalogo> sugeridas = servicio.listarTodos().stream()
                .filter(v -> aplicaEdad(v.getEdadrecomendada(), edad))
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("edad", edad, "vacunas", sugeridas));
    }

    private boolean aplicaEdad(String edadrecomendada, int edad) {
        if (edadrecomendada == null || edadrecomendada.isBlank()) return true;
        String t = edadrecomendada.toLowerCase().trim();
        if (t.contains("todas") || t.contains("todos") || t.contains("general")) return true;
        if (t.contains("adulto") && edad >= 18) return true;
        if ((t.contains("nino") || t.contains("infantil")) && edad < 12) return true;
        if (t.contains("adolescente") && edad >= 12 && edad < 18) return true;
        try {
            if (t.contains("-")) {
                String[] p = t.replaceAll("[^0-9-]","").split("-");
                if (p.length == 2) return edad >= Integer.parseInt(p[0]) && edad <= Integer.parseInt(p[1]);
            }
        } catch (Exception ignored) {}
        return true;
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

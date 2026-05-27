package com.vaxminder.controlador;

import com.vaxminder.servicio.AnaliticsServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoints para datos analíticos personalizados
 * PACIENTES: Datos motivacionales personalizados
 * CENTROS: Estadísticas del centro médico
 */
@RestController
@RequestMapping("/api/analitics")
public class AnaliticsControlador {

    @Autowired private AnaliticsServicio analiticsServicio;

    /**
     * GET /api/analitics/paciente/{idusuario}
     * Retorna datos motivacionales personalizados del paciente:
     * - Personas que se han vacunado con las mismas vacunas
     * - Quiénes completaron su esquema
     * - Progreso del paciente
     * - Mensaje motivacional
     */
    @GetMapping("/paciente/{idusuario}")
    public ResponseEntity<Map<String, Object>> obtenerDatosMotivacionalesPaciente(
            @PathVariable Integer idusuario) {
        try {
            Map<String, Object> datos = analiticsServicio.obtenerDatosMotivacionales(idusuario);
            return ResponseEntity.ok(datos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al obtener datos motivacionales: " + e.getMessage()));
        }
    }

    /**
     * GET /api/analitics/centro/{idcentro}
     * Retorna estadísticas del centro médico:
     * - Personas vacunadas
     * - Total de dosis aplicadas
     * - Promedio de dosis por persona
     * - Vacunas más aplicadas
     */
    @GetMapping("/centro/{idcentro}")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasCentro(
            @PathVariable Integer idcentro) {
        try {
            Map<String, Object> stats = analiticsServicio.obtenerEstadisticasCentro(idcentro);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al obtener estadísticas del centro: " + e.getMessage()));
        }
    }
}

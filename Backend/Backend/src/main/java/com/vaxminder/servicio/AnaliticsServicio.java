package com.vaxminder.servicio;

import com.vaxminder.modelo.RegistroVacunacion;
import com.vaxminder.repositorio.RegistroVacunacionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnaliticsServicio {

    @Autowired private RegistroVacunacionRepositorio registroRepo;
    @Autowired private VacunasCatalogoServicio vacunasServicio;

    /**
     * Obtiene datos motivacionales personalizados del paciente
     * Retorna:
     * - Número de personas que se han vacunado con las MISMAS vacunas que el paciente
     * - Cuántos han completado su esquema de vacunación
     * - Progreso del paciente
     */
    public Map<String, Object> obtenerDatosMotivacionales(Integer idusuario) {
        Map<String, Object> resultado = new HashMap<>();

        // 1. Obtener registros del paciente
        List<RegistroVacunacion> registrosPaciente = registroRepo.findByIdusuario(idusuario);
        
        if (registrosPaciente.isEmpty()) {
            resultado.put("personasConMismasVacunas", new ArrayList<>());
            resultado.put("esquemasCompletados", new ArrayList<>());
            resultado.put("progresoPaciente", Collections.emptyMap());
            resultado.put("mensaje", "Aún no has registrado vacunaciones");
            return resultado;
        }

        // 2. Extraer vacunas del paciente (nombres únicos)
        Set<String> vacunasPaciente = new HashSet<>();
        Map<String, Integer> dosisRequeridaMap = new HashMap<>();
        Map<String, Integer> dosisAplicadasMap = new HashMap<>();

        for (RegistroVacunacion reg : registrosPaciente) {
            String nombreVacuna = reg.getIdvacuna().getNombrevacuna();
            vacunasPaciente.add(nombreVacuna);
            
            int requeridas = reg.getIdvacuna().getDosisrequeridas() != null ? 
                            reg.getIdvacuna().getDosisrequeridas() : 1;
            dosisRequeridaMap.put(nombreVacuna, requeridas);
            
            dosisAplicadasMap.merge(nombreVacuna, 
                                   (reg.getNumerodosis() != null ? reg.getNumerodosis() : 1),
                                   Math::max);
        }

        // 3. Buscar otros usuarios con las mismas vacunas
        List<RegistroVacunacion> todosRegistros = registroRepo.findAll();
        Map<String, Integer> personasConVacuna = new HashMap<>();
        Map<String, Integer> personasEsquemaCompleto = new HashMap<>();

        Set<Integer> usuariosUnicos = new HashSet<>();
        
        for (String vacuna : vacunasPaciente) {
            personasConVacuna.put(vacuna, 0);
            personasEsquemaCompleto.put(vacuna, 0);
        }

        // Contar personas por vacuna y esquema
        for (RegistroVacunacion reg : todosRegistros) {
            if (reg.getIdvacuna() == null) continue;
            
            String nombreVacuna = reg.getIdvacuna().getNombrevacuna();
            
            if (vacunasPaciente.contains(nombreVacuna)) {
                usuariosUnicos.add(reg.getIdusuario());
                personasConVacuna.put(nombreVacuna, personasConVacuna.getOrDefault(nombreVacuna, 0) + 1);
            }
        }

        // Contar esquemas completos por vacuna
        Map<Integer, Map<String, Integer>> registrosPorUsuario = new HashMap<>();
        for (RegistroVacunacion reg : todosRegistros) {
            if (reg.getIdvacuna() == null) continue;
            String nombreVacuna = reg.getIdvacuna().getNombrevacuna();
            if (vacunasPaciente.contains(nombreVacuna)) {
                registrosPorUsuario.computeIfAbsent(reg.getIdusuario(), k -> new HashMap<>())
                    .merge(nombreVacuna, 
                           reg.getNumerodosis() != null ? reg.getNumerodosis() : 1, 
                           Math::max);
            }
        }

        for (Map<String, Integer> usuarioDosis : registrosPorUsuario.values()) {
            for (String vacuna : vacunasPaciente) {
                int dosisAplicadas = usuarioDosis.getOrDefault(vacuna, 0);
                int dosisRequeridas = dosisRequeridaMap.getOrDefault(vacuna, 1);
                if (dosisAplicadas >= dosisRequeridas) {
                    personasEsquemaCompleto.put(vacuna, 
                        personasEsquemaCompleto.get(vacuna) + 1);
                }
            }
        }

        // 4. Construir datos para mostrar
        List<Map<String, Object>> datosVacunas = new ArrayList<>();
        for (String vacuna : vacunasPaciente) {
            Map<String, Object> datosVacuna = new HashMap<>();
            datosVacuna.put("nombrevacuna", vacuna);
            datosVacuna.put("personasConMismaVacuna", personasConVacuna.getOrDefault(vacuna, 0));
            datosVacuna.put("personasEsquemaCompleto", personasEsquemaCompleto.getOrDefault(vacuna, 0));
            datosVacuna.put("dosisAplicadas", dosisAplicadasMap.getOrDefault(vacuna, 0));
            datosVacuna.put("dosisRequeridas", dosisRequeridaMap.getOrDefault(vacuna, 1));
            datosVacunas.add(datosVacuna);
        }

        // 5. Calcular progreso general del paciente
        int totalDosisRequeridas = dosisRequeridaMap.values().stream().mapToInt(Integer::intValue).sum();
        int totalDosisAplicadas = dosisAplicadasMap.values().stream().mapToInt(Integer::intValue).sum();
        double porcentajeCompletitud = totalDosisRequeridas > 0 ? 
            (totalDosisAplicadas * 100.0 / totalDosisRequeridas) : 0;

        Map<String, Object> progreso = new HashMap<>();
        progreso.put("dosisAplicadas", totalDosisAplicadas);
        progreso.put("dosisRequeridas", totalDosisRequeridas);
        progreso.put("porcentajeCompletitud", Math.round(porcentajeCompletitud));
        progreso.put("esquemasCompletos", 
            datosVacunas.stream().filter(v -> 
                (Integer)v.get("dosisAplicadas") >= (Integer)v.get("dosisRequeridas")
            ).count());

        resultado.put("personasConMismasVacunas", datosVacunas);
        resultado.put("progresoPaciente", progreso);
        
        // Mensaje motivacional
        if ((Integer)progreso.get("esquemasCompletos") > 0) {
            resultado.put("mensaje", "¡Excelente! Ya completaste " + progreso.get("esquemasCompletos") + 
                " esquema(s). Continúa así para proteger tu salud.");
        } else {
            resultado.put("mensaje", "Te faltan dosis por completar. Mira cuántas personas como tú ya " +
                "han completado sus esquemas. ¡Tú también puedes!");
        }

        return resultado;
    }

    /**
     * Obtiene estadísticas analíticas para centros médicos
     * Información: cuántas personas se vacunaron, dosis aplicadas, etc.
     */
    public Map<String, Object> obtenerEstadisticasCentro(Integer idcentro) {
        Map<String, Object> stats = new HashMap<>();
        
        List<RegistroVacunacion> registros = registroRepo.findAll().stream()
            .filter(r -> r.getIdcentromedico() != null && r.getIdcentromedico().equals(idcentro))
            .toList();

        if (registros.isEmpty()) {
            stats.put("personasVacunadas", 0);
            stats.put("totalDosis", 0);
            stats.put("promedioDosis", 0.0);
            stats.put("vacunasMasAplicadas", new ArrayList<>());
            return stats;
        }

        Set<Integer> usuariosUnicos = registros.stream()
            .map(RegistroVacunacion::getIdusuario)
            .collect(HashSet::new, HashSet::add, HashSet::addAll);

        Map<String, Integer> vacunasCount = new HashMap<>();
        for (RegistroVacunacion reg : registros) {
            if (reg.getIdvacuna() != null) {
                String nombre = reg.getIdvacuna().getNombrevacuna();
                vacunasCount.merge(nombre, 1, Integer::sum);
            }
        }

        stats.put("personasVacunadas", usuariosUnicos.size());
        stats.put("totalDosis", registros.size());
        stats.put("promedioDosis", (double) registros.size() / usuariosUnicos.size());
        stats.put("vacunasMasAplicadas", 
            vacunasCount.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(e -> Map.of("vacuna", e.getKey(), "cantidad", e.getValue()))
                .toList());

        return stats;
    }
}

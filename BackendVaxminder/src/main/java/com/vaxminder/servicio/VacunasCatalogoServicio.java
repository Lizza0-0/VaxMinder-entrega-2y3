package com.vaxminder.servicio;

import com.vaxminder.modelo.VacunasCatalogo;
import com.vaxminder.repositorio.VacunasCatalogoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VacunasCatalogoServicio {

    @Autowired private VacunasCatalogoRepositorio repo;

    public List<VacunasCatalogo> listarTodos() { return repo.findAll(); }
    public Optional<VacunasCatalogo> buscarPorId(Integer id) { return repo.findById(id); }
    public List<VacunasCatalogo> buscarPorNombre(String nombre) { return repo.findByNombre(nombre); }
    public List<VacunasCatalogo> buscarPorRefuerzo(Boolean r) { return repo.findByRefuerzo(r); }
    public VacunasCatalogo guardar(VacunasCatalogo v) { return repo.save(v); }

    public VacunasCatalogo actualizar(Integer id, VacunasCatalogo datos) {
        VacunasCatalogo v = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacuna no encontrada: " + id));
        v.setNombrevacuna(datos.getNombrevacuna());
        v.setDescripcion(datos.getDescripcion());
        v.setEdadrecomendada(datos.getEdadrecomendada());
        v.setDosisrequeridas(datos.getDosisrequeridas());
        v.setIntervalodosisdias(datos.getIntervalodosisdias());
        v.setRequiererefuerzo(datos.getRequiererefuerzo());
        return repo.save(v);
    }
}

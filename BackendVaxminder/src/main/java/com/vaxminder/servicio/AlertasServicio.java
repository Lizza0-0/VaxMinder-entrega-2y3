package com.vaxminder.servicio;

import com.vaxminder.modelo.Alertas;
import com.vaxminder.repositorio.AlertasRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlertasServicio {

    @Autowired private AlertasRepositorio repo;

    public List<Alertas> listarTodos() { return repo.findAll(); }
    public Optional<Alertas> buscarPorId(Integer id) { return repo.findById(id); }
    public List<Alertas> buscarPorUsuario(String id) { return repo.findByUsuario(id); }
    public List<Alertas> buscarPorEstado(String estado) { return repo.findByEstado(estado); }
    public List<Alertas> buscarPorUsuarioYEstado(String id, String estado) {
        return repo.findByUsuarioAndEstado(id, estado);
    }
}

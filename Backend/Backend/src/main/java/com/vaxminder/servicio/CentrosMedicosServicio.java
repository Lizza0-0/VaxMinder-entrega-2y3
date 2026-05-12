package com.vaxminder.servicio;

import com.vaxminder.modelo.CentrosMedicos;
import com.vaxminder.repositorio.CentrosMedicosRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CentrosMedicosServicio {

    @Autowired private CentrosMedicosRepositorio repo;

    public List<CentrosMedicos> listarTodos() { return repo.findAll(); }
    public Optional<CentrosMedicos> buscarPorId(Integer id) { return repo.findById(id); }
    public List<CentrosMedicos> buscarPorCiudad(String ciudad) { return repo.findByCiudad(ciudad); }
    public List<CentrosMedicos> buscarPorTipo(String tipo) { return repo.findByTipo(tipo); }
    public CentrosMedicos guardar(CentrosMedicos c) { return repo.save(c); }
}

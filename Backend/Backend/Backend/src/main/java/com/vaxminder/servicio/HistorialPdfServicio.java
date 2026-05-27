package com.vaxminder.servicio;

import com.vaxminder.dto.HistorialPdfDTO;
import com.vaxminder.modelo.HistorialPdf;
import com.vaxminder.modelo.Usuarios;
import com.vaxminder.repositorio.HistorialPdfRepositorio;
import com.vaxminder.repositorio.UsuariosRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialPdfServicio {

    @Autowired private HistorialPdfRepositorio repo;
    @Autowired private UsuariosRepositorio     usuariosRepo;

    public List<HistorialPdf> listarTodos() { return repo.findAll(); }
    public Optional<HistorialPdf> buscarPorId(Integer id) { return repo.findById(id); }
    public List<HistorialPdf> buscarPorUsuario(Integer id) { return repo.findByUsuario(id); }

    public HistorialPdf guardar(HistorialPdfDTO dto) {
        Usuarios u = usuariosRepo.findById(dto.getIdusuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + dto.getIdusuario()));
        HistorialPdf h = new HistorialPdf();
        h.setIdusuario(u);
        h.setFechageneracion(dto.getFechageneracion() != null ? dto.getFechageneracion() : java.time.LocalDateTime.now());
        h.setNombrearchivo(dto.getNombrearchivo());
        h.setRutaarchivo(dto.getRutaarchivo());
        return repo.save(h);
    }
}

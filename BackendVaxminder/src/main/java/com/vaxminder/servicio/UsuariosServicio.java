package com.vaxminder.servicio;

import com.vaxminder.dto.UsuarioRegistroDTO;
import com.vaxminder.dto.UsuarioResponseDTO;
import com.vaxminder.modelo.Usuarios;
import com.vaxminder.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuariosServicio {

    @Autowired private UsuariosRepositorio           repo;
    @Autowired private PasswordEncoder               passwordEncoder;
    @Autowired private RegistroVacunacionRepositorio registroRepo;
    @Autowired private AlertasRepositorio            alertasRepo;
    @Autowired private HistorialPdfRepositorio       historialRepo;

    public List<UsuarioResponseDTO> listarTodos() {
        return repo.findAll().stream().map(UsuarioResponseDTO::new).collect(Collectors.toList());
    }

    public Optional<UsuarioResponseDTO> buscarPorId(String id) {
        return repo.findById(id).map(UsuarioResponseDTO::new);
    }

    public Optional<Usuarios> buscarEntidad(String id) {
        return repo.findById(id);
    }

    public UsuarioResponseDTO registrar(UsuarioRegistroDTO dto) {
        if (repo.existsById(dto.getIdusuario()))
            throw new RuntimeException("Ya existe un usuario con la cedula: " + dto.getIdusuario());
        if (repo.existsByEmail(dto.getEmail()))
            throw new RuntimeException("El email ya esta registrado");

        Usuarios u = new Usuarios();
        u.setIdusuario(dto.getIdusuario());
        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setEmail(dto.getEmail());
        u.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        u.setFechanacimiento(dto.getFechanacimiento());
        u.setTipodocumento(dto.getTipodocumento());
        u.setTiposangre(dto.getTiposangre());
        u.setTelefono(dto.getTelefono());
        u.setRol("usuario");
        return new UsuarioResponseDTO(repo.save(u));
    }

    public UsuarioResponseDTO actualizar(String id, UsuarioRegistroDTO dto) {
        Usuarios u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        if (!u.getEmail().equals(dto.getEmail()) && repo.existsByEmail(dto.getEmail()))
            throw new RuntimeException("El email ya esta registrado");
        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setEmail(dto.getEmail());
        u.setTelefono(dto.getTelefono());
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank())
            u.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        return new UsuarioResponseDTO(repo.save(u));
    }

    public void eliminar(String id) {
        if (!repo.existsById(id))
            throw new RuntimeException("Usuario no encontrado: " + id);
        if (!registroRepo.findByUsuario(id).isEmpty())
            throw new RuntimeException("No se puede eliminar: tiene vacunaciones registradas");
        if (!alertasRepo.findByUsuario(id).isEmpty())
            throw new RuntimeException("No se puede eliminar: tiene alertas asociadas");
        if (!historialRepo.findByUsuario(id).isEmpty())
            throw new RuntimeException("No se puede eliminar: tiene historial PDF asociado");
        repo.deleteById(id);
    }

    public boolean verificarContrasena(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }
}

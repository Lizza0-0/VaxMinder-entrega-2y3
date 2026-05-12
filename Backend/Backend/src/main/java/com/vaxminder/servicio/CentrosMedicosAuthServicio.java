package com.vaxminder.servicio;

import com.vaxminder.dto.CentroActualizarDTO;
import com.vaxminder.dto.CentroRegistroDTO;
import com.vaxminder.dto.CentroResponseDTO;
import com.vaxminder.modelo.CentrosMedicosAuth;
import com.vaxminder.repositorio.CentrosMedicosAuthRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CentrosMedicosAuthServicio {

    @Autowired private CentrosMedicosAuthRepositorio repo;
    @Autowired private PasswordEncoder passwordEncoder;

    public CentroResponseDTO registrar(CentroRegistroDTO dto) {
        if (repo.existsById(dto.getNit()))
            throw new RuntimeException("Ya existe un centro registrado con el NIT: " + dto.getNit());
        CentrosMedicosAuth c = new CentrosMedicosAuth();
        c.setNit(dto.getNit());
        c.setRazonsocial(dto.getRazonsocial());
        c.setTipodocumento("NIT");
        c.setDireccion(dto.getDireccion());
        c.setCiudad(dto.getCiudad());
        c.setTelefono(dto.getTelefono());
        c.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        return new CentroResponseDTO(repo.save(c));
    }

    public Optional<CentrosMedicosAuth> buscarEntidad(String nit) {
        return repo.findById(nit);
    }

    public boolean verificarContrasena(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }

    public CentroResponseDTO actualizarPerfil(String nit, CentroActualizarDTO dto) {
        CentrosMedicosAuth c = repo.findById(nit)
                .orElseThrow(() -> new RuntimeException("Centro no encontrado con NIT: " + nit));
        if (dto.getRazonsocial() != null && !dto.getRazonsocial().isBlank())
            c.setRazonsocial(dto.getRazonsocial().trim());
        if (dto.getDireccion() != null && !dto.getDireccion().isBlank())
            c.setDireccion(dto.getDireccion().trim());
        if (dto.getTelefono() != null && !dto.getTelefono().isBlank())
            c.setTelefono(dto.getTelefono().trim());
        if (dto.getCiudad() != null && !dto.getCiudad().isBlank())
            c.setCiudad(dto.getCiudad().trim());
        return new CentroResponseDTO(repo.save(c));
    }
}

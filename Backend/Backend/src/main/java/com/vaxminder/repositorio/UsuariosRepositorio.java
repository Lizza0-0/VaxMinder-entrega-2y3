package com.vaxminder.repositorio;

import com.vaxminder.modelo.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuariosRepositorio extends JpaRepository<Usuarios, Integer> {

    Optional<Usuarios> findByEmail(String email);
    boolean existsByEmail(String email);
}

package com.vaxminder.repositorio;

import com.vaxminder.modelo.RegistroVacunacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroVacunacionRepositorio extends JpaRepository<RegistroVacunacion, Integer> {

    @Query("SELECT r FROM RegistroVacunacion r WHERE r.idusuario.idusuario = :id")
    List<RegistroVacunacion> findByUsuario(@Param("id") String id);
}

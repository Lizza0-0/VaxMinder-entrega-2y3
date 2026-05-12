package com.vaxminder.repositorio;

import com.vaxminder.modelo.Alertas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertasRepositorio extends JpaRepository<Alertas, Integer> {

    @Query("SELECT a FROM Alertas a WHERE a.idusuario.idusuario = :id")
    List<Alertas> findByUsuario(@Param("id") String id);

    @Query("SELECT a FROM Alertas a WHERE a.estado = :estado")
    List<Alertas> findByEstado(@Param("estado") String estado);

    @Query("SELECT a FROM Alertas a WHERE a.idusuario.idusuario = :id AND a.estado = :estado")
    List<Alertas> findByUsuarioAndEstado(@Param("id") String id, @Param("estado") String estado);
}

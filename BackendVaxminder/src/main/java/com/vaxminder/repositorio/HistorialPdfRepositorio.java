package com.vaxminder.repositorio;

import com.vaxminder.modelo.HistorialPdf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialPdfRepositorio extends JpaRepository<HistorialPdf, Integer> {

    @Query("SELECT h FROM HistorialPdf h WHERE h.idusuario.idusuario = :id")
    List<HistorialPdf> findByUsuario(@Param("id") String id);
}

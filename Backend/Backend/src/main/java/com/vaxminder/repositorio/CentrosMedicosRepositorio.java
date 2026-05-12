package com.vaxminder.repositorio;

import com.vaxminder.modelo.CentrosMedicos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CentrosMedicosRepositorio extends JpaRepository<CentrosMedicos, Integer> {

    @Query("SELECT c FROM CentrosMedicos c WHERE LOWER(c.ciudad) = LOWER(:ciudad)")
    List<CentrosMedicos> findByCiudad(@Param("ciudad") String ciudad);

    @Query("SELECT c FROM CentrosMedicos c WHERE LOWER(c.tipocentro) = LOWER(:tipo)")
    List<CentrosMedicos> findByTipo(@Param("tipo") String tipo);
}

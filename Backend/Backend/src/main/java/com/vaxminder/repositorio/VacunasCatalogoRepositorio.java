package com.vaxminder.repositorio;

import com.vaxminder.modelo.VacunasCatalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VacunasCatalogoRepositorio extends JpaRepository<VacunasCatalogo, Integer> {

    @Query("SELECT v FROM VacunasCatalogo v WHERE LOWER(v.nombrevacuna) LIKE LOWER(CONCAT('%',:nombre,'%'))")
    List<VacunasCatalogo> findByNombre(@Param("nombre") String nombre);

    @Query("SELECT v FROM VacunasCatalogo v WHERE v.requiererefuerzo = :requiere")
    List<VacunasCatalogo> findByRefuerzo(@Param("requiere") Boolean requiere);
}

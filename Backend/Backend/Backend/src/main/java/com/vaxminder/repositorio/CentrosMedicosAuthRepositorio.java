package com.vaxminder.repositorio;

import com.vaxminder.modelo.CentrosMedicosAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CentrosMedicosAuthRepositorio extends JpaRepository<CentrosMedicosAuth, String> {
}

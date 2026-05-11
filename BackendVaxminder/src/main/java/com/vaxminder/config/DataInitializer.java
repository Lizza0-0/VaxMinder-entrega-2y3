package com.vaxminder.config;

import com.vaxminder.modelo.Usuarios;
import com.vaxminder.repositorio.UsuariosRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UsuariosRepositorio repo;
    @Autowired private PasswordEncoder     passwordEncoder;

    @Override
    public void run(String... args) {
        if (repo.existsById("CMED01")) return;

        Usuarios admin = new Usuarios();
        admin.setIdusuario("CMED01");
        admin.setNombre("Centro Medico");
        admin.setApellido("Admin");
        admin.setEmail("admin@vaxminder.com");
        admin.setContrasena(passwordEncoder.encode("admin123"));
        admin.setFechanacimiento(LocalDate.of(1990, 1, 1));
        admin.setTipodocumento("CC");
        admin.setTiposangre("O+");
        admin.setTelefono("0000000000");
        admin.setRol("admin");
        repo.save(admin);
    }
}

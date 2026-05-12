package com.vaxminder.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuarios {

    @Id
    @Column(name = "idusuario", length = 20)
    private String idusuario;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "tipodocumento", nullable = false)
    private String tipodocumento;

    @Column(name = "fechanacimiento", nullable = false)
    private LocalDate fechanacimiento;

    @Column(name = "tiposangre")
    private String tiposangre;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "rol", nullable = false)
    private String rol = "usuario";

    @Column(name = "fecharegistro")
    private LocalDateTime fecharegistro;

    @PrePersist
    public void prePersist() {
        if (this.fecharegistro == null)
            this.fecharegistro = LocalDateTime.now();
    }

    public String getIdusuario() { return idusuario; }
    public void setIdusuario(String idusuario) { this.idusuario = idusuario; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getTipodocumento() { return tipodocumento; }
    public void setTipodocumento(String tipodocumento) { this.tipodocumento = tipodocumento; }

    public LocalDate getFechanacimiento() { return fechanacimiento; }
    public void setFechanacimiento(LocalDate fechanacimiento) { this.fechanacimiento = fechanacimiento; }

    public String getTiposangre() { return tiposangre; }
    public void setTiposangre(String tiposangre) { this.tiposangre = tiposangre; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDateTime getFecharegistro() { return fecharegistro; }
    public void setFecharegistro(LocalDateTime fecharegistro) { this.fecharegistro = fecharegistro; }
}

package com.vaxminder.dto;

import java.time.LocalDate;

public class UsuarioRegistroDTO {

    private String idusuario;
    private String rol;
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String tipodocumento;
    private LocalDate fechanacimiento;
    private String tiposangre;
    private String telefono;

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
}

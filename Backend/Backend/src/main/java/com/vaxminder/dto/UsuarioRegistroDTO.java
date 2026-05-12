package com.vaxminder.dto;

import java.time.LocalDate;

public class UsuarioRegistroDTO {

    private Integer idusuario;
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String tipodocumento;
    private LocalDate fechanacimiento;
    private String tiposangre;
    private String telefono;

    public Integer getIdusuario() { return idusuario; }
    public void setIdusuario(Integer idusuario) { this.idusuario = idusuario; }

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

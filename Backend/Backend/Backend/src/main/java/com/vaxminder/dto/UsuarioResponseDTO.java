package com.vaxminder.dto;

import com.vaxminder.modelo.Usuarios;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UsuarioResponseDTO {

    private Integer idusuario;
    private String nombre;
    private String apellido;
    private String email;
    private String tipodocumento;
    private LocalDate fechanacimiento;
    private String tiposangre;
    private String telefono;
    private LocalDateTime fecharegistro;

    public UsuarioResponseDTO(Usuarios u) {
        this.idusuario      = u.getIdusuario();
        this.nombre         = u.getNombre();
        this.apellido       = u.getApellido();
        this.email          = u.getEmail();
        this.tipodocumento  = u.getTipodocumento();
        this.fechanacimiento = u.getFechanacimiento();
        this.tiposangre     = u.getTiposangre();
        this.telefono       = u.getTelefono();
        this.fecharegistro  = u.getFecharegistro();
    }

    public Integer getIdusuario() { return idusuario; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getEmail() { return email; }
    public String getTipodocumento() { return tipodocumento; }
    public LocalDate getFechanacimiento() { return fechanacimiento; }
    public String getTiposangre() { return tiposangre; }
    public String getTelefono() { return telefono; }
    public LocalDateTime getFecharegistro() { return fecharegistro; }
}

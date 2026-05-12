package com.vaxminder.dto;

import com.vaxminder.modelo.CentrosMedicosAuth;
import java.time.LocalDateTime;

public class CentroResponseDTO {
    private String nit;
    private String razonsocial;
    private String tipodocumento;
    private String direccion;
    private String ciudad;
    private String telefono;
    private LocalDateTime fecharegistro;

    public CentroResponseDTO(CentrosMedicosAuth c) {
        this.nit           = c.getNit();
        this.razonsocial   = c.getRazonsocial();
        this.tipodocumento = c.getTipodocumento();
        this.direccion     = c.getDireccion();
        this.ciudad        = c.getCiudad();
        this.telefono      = c.getTelefono();
        this.fecharegistro = c.getFecharegistro();
    }
    public String getNit() { return nit; }
    public String getRazonsocial() { return razonsocial; }
    public String getTipodocumento() { return tipodocumento; }
    public String getDireccion() { return direccion; }
    public String getCiudad() { return ciudad; }
    public String getTelefono() { return telefono; }
    public LocalDateTime getFecharegistro() { return fecharegistro; }
}

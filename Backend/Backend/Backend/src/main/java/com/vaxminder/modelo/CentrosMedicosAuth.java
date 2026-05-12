package com.vaxminder.modelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "centrosmedicosauth")
public class CentrosMedicosAuth {

    @Id
    @Column(name = "nit", length = 20)
    private String nit;

    @Column(name = "razonsocial", nullable = false)
    private String razonsocial;

    @Column(name = "tipodocumento", nullable = false)
    private String tipodocumento = "NIT";

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "ciudad", nullable = false)
    private String ciudad;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "fecharegistro")
    private LocalDateTime fecharegistro;

    @PrePersist
    public void prePersist() {
        if (this.fecharegistro == null) this.fecharegistro = LocalDateTime.now();
        this.tipodocumento = "NIT";
    }

    public String getNit() { return nit; }
    public void setNit(String nit) { this.nit = nit; }
    public String getRazonsocial() { return razonsocial; }
    public void setRazonsocial(String razonsocial) { this.razonsocial = razonsocial; }
    public String getTipodocumento() { return tipodocumento; }
    public void setTipodocumento(String tipodocumento) { this.tipodocumento = tipodocumento; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public LocalDateTime getFecharegistro() { return fecharegistro; }
    public void setFecharegistro(LocalDateTime fecharegistro) { this.fecharegistro = fecharegistro; }
}

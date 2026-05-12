package com.vaxminder.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "centrosmedicos")
public class CentrosMedicos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcentro")
    private Integer idcentro;

    @Column(name = "nombrecentro", nullable = false)
    private String nombrecentro;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "ciudad", nullable = false)
    private String ciudad;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "tipocentro")
    private String tipocentro;

    public Integer getIdcentro() { return idcentro; }
    public void setIdcentro(Integer idcentro) { this.idcentro = idcentro; }

    public String getNombrecentro() { return nombrecentro; }
    public void setNombrecentro(String nombrecentro) { this.nombrecentro = nombrecentro; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getTipocentro() { return tipocentro; }
    public void setTipocentro(String tipocentro) { this.tipocentro = tipocentro; }
}

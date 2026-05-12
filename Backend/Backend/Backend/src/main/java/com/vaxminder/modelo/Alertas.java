package com.vaxminder.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
public class Alertas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idalerta")
    private Integer idalerta;

    @ManyToOne
    @JoinColumn(name = "idusuario", nullable = false)
    private Usuarios idusuario;

    @ManyToOne
    @JoinColumn(name = "idregistro")
    private RegistroVacunacion idregistro;

    @Column(name = "tipoalerta", nullable = false)
    private String tipoalerta;

    @Column(name = "fechaalerta", nullable = false)
    private LocalDate fechaalerta;

    @Column(name = "mensaje", nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "estado")
    private String estado = "pendiente";

    @Column(name = "fechaenvio")
    private LocalDateTime fechaenvio;

    public Integer getIdalerta() { return idalerta; }
    public void setIdalerta(Integer idalerta) { this.idalerta = idalerta; }

    public Usuarios getIdusuario() { return idusuario; }
    public void setIdusuario(Usuarios idusuario) { this.idusuario = idusuario; }

    public RegistroVacunacion getIdregistro() { return idregistro; }
    public void setIdregistro(RegistroVacunacion idregistro) { this.idregistro = idregistro; }

    public String getTipoalerta() { return tipoalerta; }
    public void setTipoalerta(String tipoalerta) { this.tipoalerta = tipoalerta; }

    public LocalDate getFechaalerta() { return fechaalerta; }
    public void setFechaalerta(LocalDate fechaalerta) { this.fechaalerta = fechaalerta; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaenvio() { return fechaenvio; }
    public void setFechaenvio(LocalDateTime fechaenvio) { this.fechaenvio = fechaenvio; }
}

package com.vaxminder.modelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historialpdf")
public class HistorialPdf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idhistorial")
    private Integer idhistorial;

    @ManyToOne
    @JoinColumn(name = "idusuario", nullable = false)
    private Usuarios idusuario;

    @Column(name = "fechageneracion")
    private LocalDateTime fechageneracion;

    @Column(name = "nombrearchivo", nullable = false)
    private String nombrearchivo;

    @Column(name = "rutaarchivo", nullable = false)
    private String rutaarchivo;

    @PrePersist
    public void prePersist() {
        if (this.fechageneracion == null)
            this.fechageneracion = LocalDateTime.now();
    }

    public Integer getIdhistorial() { return idhistorial; }
    public void setIdhistorial(Integer idhistorial) { this.idhistorial = idhistorial; }

    public Usuarios getIdusuario() { return idusuario; }
    public void setIdusuario(Usuarios idusuario) { this.idusuario = idusuario; }

    public LocalDateTime getFechageneracion() { return fechageneracion; }
    public void setFechageneracion(LocalDateTime fechageneracion) { this.fechageneracion = fechageneracion; }

    public String getNombrearchivo() { return nombrearchivo; }
    public void setNombrearchivo(String nombrearchivo) { this.nombrearchivo = nombrearchivo; }

    public String getRutaarchivo() { return rutaarchivo; }
    public void setRutaarchivo(String rutaarchivo) { this.rutaarchivo = rutaarchivo; }
}

package com.vaxminder.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "registrovacunacion")
public class RegistroVacunacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idregistro")
    private Integer idregistro;

    @ManyToOne
    @JoinColumn(name = "idusuario", nullable = false)
    private Usuarios idusuario;

    @ManyToOne
    @JoinColumn(name = "idvacuna", nullable = false)
    private VacunasCatalogo idvacuna;

    @Column(name = "fechaaplicacion", nullable = false)
    private LocalDate fechaaplicacion;

    @Column(name = "numerodosis", nullable = false)
    private Integer numerodosis;

    @Column(name = "lotevacuna")
    private String lotevacuna;

    @ManyToOne
    @JoinColumn(name = "idcentromedico")
    private CentrosMedicos idcentromedico;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "proximadosisfecha")
    private LocalDate proximadosisfecha;

    public Integer getIdregistro() { return idregistro; }
    public void setIdregistro(Integer idregistro) { this.idregistro = idregistro; }

    public Usuarios getIdusuario() { return idusuario; }
    public void setIdusuario(Usuarios idusuario) { this.idusuario = idusuario; }

    public VacunasCatalogo getIdvacuna() { return idvacuna; }
    public void setIdvacuna(VacunasCatalogo idvacuna) { this.idvacuna = idvacuna; }

    public LocalDate getFechaaplicacion() { return fechaaplicacion; }
    public void setFechaaplicacion(LocalDate fechaaplicacion) { this.fechaaplicacion = fechaaplicacion; }

    public Integer getNumerodosis() { return numerodosis; }
    public void setNumerodosis(Integer numerodosis) { this.numerodosis = numerodosis; }

    public String getLotevacuna() { return lotevacuna; }
    public void setLotevacuna(String lotevacuna) { this.lotevacuna = lotevacuna; }

    public CentrosMedicos getIdcentromedico() { return idcentromedico; }
    public void setIdcentromedico(CentrosMedicos idcentromedico) { this.idcentromedico = idcentromedico; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public LocalDate getProximadosisfecha() { return proximadosisfecha; }
    public void setProximadosisfecha(LocalDate proximadosisfecha) { this.proximadosisfecha = proximadosisfecha; }
}

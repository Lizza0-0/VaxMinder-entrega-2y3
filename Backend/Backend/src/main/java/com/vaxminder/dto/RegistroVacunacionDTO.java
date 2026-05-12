package com.vaxminder.dto;

import java.time.LocalDate;

public class RegistroVacunacionDTO {

    private Integer idusuario;
    private Integer idvacuna;
    private LocalDate fechaaplicacion;
    private Integer numerodosis;
    private String lotevacuna;
    private Integer idcentromedico;
    private String observaciones;
    private LocalDate proximadosisfecha;

    public Integer getIdusuario() { return idusuario; }
    public void setIdusuario(Integer idusuario) { this.idusuario = idusuario; }

    public Integer getIdvacuna() { return idvacuna; }
    public void setIdvacuna(Integer idvacuna) { this.idvacuna = idvacuna; }

    public LocalDate getFechaaplicacion() { return fechaaplicacion; }
    public void setFechaaplicacion(LocalDate fechaaplicacion) { this.fechaaplicacion = fechaaplicacion; }

    public Integer getNumerodosis() { return numerodosis; }
    public void setNumerodosis(Integer numerodosis) { this.numerodosis = numerodosis; }

    public String getLotevacuna() { return lotevacuna; }
    public void setLotevacuna(String lotevacuna) { this.lotevacuna = lotevacuna; }

    public Integer getIdcentromedico() { return idcentromedico; }
    public void setIdcentromedico(Integer idcentromedico) { this.idcentromedico = idcentromedico; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public LocalDate getProximadosisfecha() { return proximadosisfecha; }
    public void setProximadosisfecha(LocalDate proximadosisfecha) { this.proximadosisfecha = proximadosisfecha; }
}

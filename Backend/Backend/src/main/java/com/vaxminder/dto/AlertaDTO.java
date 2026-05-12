package com.vaxminder.dto;

import java.time.LocalDate;

public class AlertaDTO {

    private Integer idusuario;
    private Integer idregistro;
    private String tipoalerta;
    private LocalDate fechaalerta;
    private String mensaje;
    private String estado;

    public Integer getIdusuario() { return idusuario; }
    public void setIdusuario(Integer idusuario) { this.idusuario = idusuario; }

    public Integer getIdregistro() { return idregistro; }
    public void setIdregistro(Integer idregistro) { this.idregistro = idregistro; }

    public String getTipoalerta() { return tipoalerta; }
    public void setTipoalerta(String tipoalerta) { this.tipoalerta = tipoalerta; }

    public LocalDate getFechaalerta() { return fechaalerta; }
    public void setFechaalerta(LocalDate fechaalerta) { this.fechaalerta = fechaalerta; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

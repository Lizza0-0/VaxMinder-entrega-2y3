package com.vaxminder.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "vacunascatalogo")
public class VacunasCatalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idvacuna")
    private Integer idvacuna;

    @Column(name = "nombrevacuna", nullable = false)
    private String nombrevacuna;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "edadrecomendada")
    private String edadrecomendada;

    @Column(name = "dosisrequeridas", nullable = false)
    private Integer dosisrequeridas;

    @Column(name = "intervalodosisdias")
    private Integer intervalodosisdias;

    @Column(name = "requiererefuerzo")
    private Boolean requiererefuerzo = false;

    public Integer getIdvacuna() { return idvacuna; }
    public void setIdvacuna(Integer idvacuna) { this.idvacuna = idvacuna; }

    public String getNombrevacuna() { return nombrevacuna; }
    public void setNombrevacuna(String nombrevacuna) { this.nombrevacuna = nombrevacuna; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEdadrecomendada() { return edadrecomendada; }
    public void setEdadrecomendada(String edadrecomendada) { this.edadrecomendada = edadrecomendada; }

    public Integer getDosisrequeridas() { return dosisrequeridas; }
    public void setDosisrequeridas(Integer dosisrequeridas) { this.dosisrequeridas = dosisrequeridas; }

    public Integer getIntervalodosisdias() { return intervalodosisdias; }
    public void setIntervalodosisdias(Integer intervalodosisdias) { this.intervalodosisdias = intervalodosisdias; }

    public Boolean getRequiererefuerzo() { return requiererefuerzo; }
    public void setRequiererefuerzo(Boolean requiererefuerzo) { this.requiererefuerzo = requiererefuerzo; }
}

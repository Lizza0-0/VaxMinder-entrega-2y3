package com.vaxminder.dto;

public class CentroRegistroDTO {
    private String nit;
    private String razonsocial;
    private String tipodocumento;
    private String direccion;
    private String ciudad;
    private String telefono;
    private String contrasena;

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
}

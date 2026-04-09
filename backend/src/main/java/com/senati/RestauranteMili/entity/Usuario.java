package com.senati.RestauranteMili.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {
    public enum Rol {
        administrador, mozo, cocina
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false, length = 100)
    private String contraseña;

    // Constructores
    public Usuario() {
    }

    public Usuario(String nombre, Rol rol, String contraseña) {
        this.nombre = nombre;
        this.rol = rol;
        this.contraseña = contraseña;
    }
    // Getters y Setters
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }
}

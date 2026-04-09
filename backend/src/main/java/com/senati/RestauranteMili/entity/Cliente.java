package com.senati.RestauranteMili.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Usuario")
    private long Id;
    @Column(nullable = false)

}

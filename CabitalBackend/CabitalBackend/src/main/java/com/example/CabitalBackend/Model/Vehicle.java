package com.example.CabitalBackend.Model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String make;

    private String model;

    @Column(nullable = false)
    private String type; // Car | Van | Bikes | carrier vehicles

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private double basePricePerDay;

    private boolean active = true;

    private String thumbnailUrl;

    private String location;
}



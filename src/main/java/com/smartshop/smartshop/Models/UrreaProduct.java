package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UrreaProduct {

    @Id
    private String id;

    @Column(length = 20, nullable = false)
    private String codigo;

    @Column(length = 20, nullable = false)
    private String safe_sku;

    @Column(nullable = false, length = 500)
    private String nombreLargo;

    @Column(name = "descripcion_producto", columnDefinition = "TEXT")
    private String descripcionProducto;

    @Column(length = 500)
    private String marca;

    @Column(length = 1000)
    private String submarca;

    @Column(length = 1000)
    private String familia;

    @Column(length = 1000)
    private String clase;

    @Column(length = 1000)
    private String subclase;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double precio;

    @Column(length = 3)
    private String moneda;

    private Integer multiplo;

    @Column(length = 30, unique = true)
    private String codigoBarras;

    @Column(length = 255)
    private String estatusInventario;

    @Column(length = 1000)
    private String anexo20SAT;

    @Column(length = 1000)
    private String claveUnidadSAT;

    @Column(columnDefinition = "TEXT")
    private String bullets;

    private Boolean esJuego;

    private Integer piezasJuego;

    @Column(columnDefinition = "TEXT")
    private String contenidoJuego;

    @Column(columnDefinition = "TEXT")
    private String accesorios;

    @Column(length = 1000)
    private String garantia;

    @Column(length = 1000)
    private String empaque;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(length = 1000)
    private String fotografia;

    @Column(length = 1000)
    private String video;

    @Column(length = 1000)
    private String fichaTecnica;

    @Column(name = "manual_producto",length = 255)
    private String manual;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double alto;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double fondo;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double ancho;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double peso;

    @Column(columnDefinition = "TEXT")
    private String caracteristica;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}

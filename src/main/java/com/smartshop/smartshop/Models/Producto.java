package com.smartshop.smartshop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Id;
import com.smartshop.smartshop.Models.Vendor;

import java.io.Serializable;
import java.util.UUID;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Producto  implements Serializable {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column
    private String sku;
    @Column( columnDefinition = "TEXT")
    private String description;
    private double price;
    @Column(name = "image_url", length = 1024) // opcional: nombre de columna en la base de datos
    private String imageUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
    @JsonIgnore
    //@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) // <--- Añade esto
    @OneToOne(fetch = FetchType.LAZY) // <--- Añade esto
    @JoinColumn(name = "urrea_id")
    private UrreaProduct urreaProduct;

    @Column
    private String category;
    @Version
    private Integer version;
}

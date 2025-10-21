package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter // Anotaciones específicas en lugar de @Data
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString(exclude = {"tokenList", "roles", "pedidos"}) // Excluye TODAS las relaciones en colección
@EqualsAndHashCode(exclude = {"tokenList", "roles", "pedidos"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String telefono;

    // Dirección directamente en el modelo
    private String calle;
    private String ciudad;
    private String estado;
    private String pais;
    private String codigoPostal;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Token> tokenList;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;


    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles;


    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE}) // <--- Añade cascade
    @JoinTable(
            name = "usuario_roles", // Nombre de la tabla de unión (asociación)
            joinColumns = @JoinColumn(name = "usuario_id"), // Columna que referencia a Usuario
            inverseJoinColumns = @JoinColumn(name = "roles_id") // Columna que referencia a Role
    )
    private Set<Pedidos> pedidos = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
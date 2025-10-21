package com.smartshop.smartshop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartshop.smartshop.Enumeration.PedidoStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String guia;
    private PedidoStatus pedidoStatus;



    @OneToMany(mappedBy = "pedidos", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PedidoDetail> pedidoDetails = new HashSet<>();

    private double total;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;

    // --- Métodos de Ayuda ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now(); // Al crear, ambas fechas son iguales
    }

    /**
     * Este método se ejecuta automáticamente antes de que un pedido existente
     * se actualice en la base de datos.
     * Actualiza únicamente la fecha de última modificación.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addDetail(PedidoDetail detail) {
        this.pedidoDetails.add(detail);
        detail.setPedidos(this); // Sincroniza la relación en ambos sentidos
        System.out.println("--- ASOCIACIÓN COMPLETA. El campo 'pedidos' en el detalle es null? " + (detail.getPedidos() == null));
    }
    private Double costoEnvio(double precio){
        Function<Double, Double> costoPedido = (_precio) ->
                (_precio >= 2000.0) ? 0.0 : 220;
        return costoPedido.apply(precio);
    }

    public void calcularTotal() {
        this.total = this.pedidoDetails.stream()
                .mapToDouble(detail -> detail.getStatic_price() * detail.getQuantity())
                .sum();

        this.total = this.costoEnvio(this.total);

    }
}
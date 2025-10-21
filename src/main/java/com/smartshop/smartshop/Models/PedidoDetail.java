package com.smartshop.smartshop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "pedido_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"pedidos", "producto"})
@EqualsAndHashCode(of = {"id"})
public class PedidoDetail {

    @EmbeddedId
    private ProductDetailId id;


    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("pedidoId")
    @JoinColumn(name = "pedido_id", nullable = false)  // ✅ usa snake_case y quita insertable/updatable
    @JsonIgnore
    private Pedidos pedidos;


    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "producto_id", nullable = false)  // ✅ usa snake_case
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Producto producto;

    @Column(nullable = false)
    private double static_price;

    @Column(nullable = false)
    private double quantity;
}

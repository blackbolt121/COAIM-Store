package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Models.PedidoDetail;

import java.util.UUID;

public record AdminOrderItemDTO(
        UUID productId,
        String productName,
        double quantity,
        double unitPrice,
        double subtotal
) {
    public static AdminOrderItemDTO fromEntity(PedidoDetail detail) {
        if (detail == null) {
            return null;
        }

        UUID productId = detail.getProducto() != null ? detail.getProducto().getId() : null;
        String productName = detail.getProducto() != null ? detail.getProducto().getName() : null;
        double unitPrice = detail.getStatic_price();
        double quantity = detail.getQuantity();

        return new AdminOrderItemDTO(
                productId,
                productName,
                quantity,
                unitPrice,
                unitPrice * quantity
        );
    }
}

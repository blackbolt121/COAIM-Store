package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.Models.Pedidos;

import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderDTO(
        Long id,
        String userId,
        String userName,
        String userEmail,
        String guia,
        PedidoStatus status,
        double total,
        int itemsCount,
        List<AdminOrderItemDTO> items,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AdminOrderDTO fromEntity(Pedidos pedido) {
        return fromEntity(pedido, false);
    }

    public static AdminOrderDTO fromEntity(Pedidos pedido, boolean includeItems) {
        if (pedido == null) {
            return null;
        }

        String userId = null;
        String userName = null;
        String userEmail = null;
        if (pedido.getUsuario() != null) {
            userId = pedido.getUsuario().getId();
            userName = pedido.getUsuario().getName();
            userEmail = pedido.getUsuario().getEmail();
        }

        List<AdminOrderItemDTO> items = includeItems && pedido.getPedidoDetails() != null
                ? pedido.getPedidoDetails().stream()
                .map(AdminOrderItemDTO::fromEntity)
                .toList()
                : List.of();

        return new AdminOrderDTO(
                pedido.getId(),
                userId,
                userName,
                userEmail,
                pedido.getGuia(),
                pedido.getPedidoStatus(),
                pedido.getTotal(),
                pedido.getPedidoDetails() != null ? pedido.getPedidoDetails().size() : 0,
                items,
                pedido.getCreatedAt(),
                pedido.getUpdatedAt()
        );
    }
}

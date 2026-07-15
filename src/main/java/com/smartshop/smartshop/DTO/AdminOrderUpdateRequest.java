package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Enumeration.PedidoStatus;

public record AdminOrderUpdateRequest(
        String guia,
        PedidoStatus pedidoStatus
) {
}

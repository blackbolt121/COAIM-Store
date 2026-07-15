package com.smartshop.smartshop.DTO;

import java.util.List;

public record AdminDashboardDTO(
        long totalUsuarios,
        long totalProductos,
        long pedidosNuevos,
        double ingresosMes,
        List<AdminOrderDTO> ultimosPedidos,
        List<MonthlySalesDto> salesData,
        List<CategoryProductCountDto> categoryData
) {
}

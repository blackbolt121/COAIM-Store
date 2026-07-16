package com.smartshop.smartshop.DTO;

public record CotizacionItemDTO(
        String productId,
        String productName,
        String sku,
        String imageUrl,
        Integer quantity,
        Double unitPrice,
        Double subtotal
) {
}

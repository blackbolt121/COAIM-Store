package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Enumeration.CotizacionEstado;

import java.time.LocalDateTime;

public record CotizacionListItemDTO(
        String id,
        String nombre,
        String correo,
        CotizacionEstado estado,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        CotizacionCreatorDTO creadoPor,
        int itemsCount,
        double total
) {
}

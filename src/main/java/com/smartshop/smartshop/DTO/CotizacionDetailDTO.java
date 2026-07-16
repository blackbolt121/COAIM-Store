package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Enumeration.CotizacionEstado;

import java.time.LocalDateTime;
import java.util.List;

public record CotizacionDetailDTO(
        String id,
        String nombre,
        String correo,
        CotizacionEstado estado,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        CotizacionCreatorDTO creadoPor,
        List<CotizacionItemDTO> items,
        int itemsCount,
        double total
) {
}

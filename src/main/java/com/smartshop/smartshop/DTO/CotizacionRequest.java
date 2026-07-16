package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Enumeration.CotizacionEstado;

import java.util.Map;

public record CotizacionRequest(
        String nombre,
        String correo,
        Map<String, CotizacionItemRequest> productoSeleccionados,
        CotizacionEstado estado
) {
}

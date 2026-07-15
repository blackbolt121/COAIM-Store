package com.smartshop.smartshop.DTO;

import java.util.Set;

public record AdminUserUpdateRequest(
        String name,
        String email,
        String telefono,
        String calle,
        String ciudad,
        String estado,
        String pais,
        String codigoPostal,
        Boolean activo,
        Set<String> roles
) {
}

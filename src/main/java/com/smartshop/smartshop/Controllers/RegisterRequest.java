package com.smartshop.smartshop.Controllers;

public record RegisterRequest(
        String email,
        String password,
        String name,
        String telefono,
        String calle,
        String ciudad,
        String estado,
        String pais,
        String codigoPostal
) {
}
package com.smartshop.smartshop.Controllers;

public record AuthRequest(
        String email,
        String password
) {
}
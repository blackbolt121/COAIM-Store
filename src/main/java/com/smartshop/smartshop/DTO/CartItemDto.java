package com.smartshop.smartshop.DTO;

import java.util.UUID;

public record CartItemDto(
        UUID id,
        String name,
        Integer quantity
) {}
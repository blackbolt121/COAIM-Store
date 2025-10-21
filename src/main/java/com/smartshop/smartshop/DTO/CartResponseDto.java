package com.smartshop.smartshop.DTO;

import java.util.List;

public record CartResponseDto(
        Long cartId,
        List<CartItemDto> items,
        String ordenPago
) {}
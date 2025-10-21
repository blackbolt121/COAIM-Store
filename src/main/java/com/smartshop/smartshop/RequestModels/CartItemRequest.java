package com.smartshop.smartshop.RequestModels;

public record CartItemRequest(
        String productId,
        int quantity
) {}
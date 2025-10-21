package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
}

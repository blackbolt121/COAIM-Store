package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, String> {
}

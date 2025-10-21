package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, String> {
    List<Promotion> findByActiveTrueOrderByDisplayOrderAsc();
}
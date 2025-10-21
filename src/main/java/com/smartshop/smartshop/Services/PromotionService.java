package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Repositories.PromotionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smartshop.smartshop.Models.Promotion;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> findActivePromotions() {
        return promotionRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }

    public Optional<Promotion> getById(String id) {
        return promotionRepository.findById(id);
    }

    public Promotion savePromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public boolean existsById(String id) {
        return promotionRepository.existsById(id);
    }

    public void deleteById(String id) {
        promotionRepository.deleteById(id);
    }
}

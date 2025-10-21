package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Promotion;
import com.smartshop.smartshop.Services.PromotionService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Controller
@RequestMapping("/admin/promotions")
public class PromotionAdminController {

    private final PromotionService promotionService;

    public PromotionAdminController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public String listPromotions(Model model) {
        model.addAttribute("promotions", promotionService.findAll());
        return "promotions";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("promotion", new Promotion());
        model.addAttribute("action", "/admin/promotions/create");
        return "promotion_form";
    }

    @PostMapping("/create")
    public String createPromotion(@ModelAttribute Promotion promotion,
                                  @RequestParam("imageFile") MultipartFile imageFile) throws Exception {

        Promotion promotion1 = new Promotion();
        promotion1.setId(UUID.randomUUID().toString());
        promotion1.setTitle(promotion.getTitle());
        promotion1.setStartDate(promotion.getStartDate());
        promotion1.setEndDate(promotion.getEndDate());
        promotion1.setImage(imageFile.getBytes());
        promotion1.setActive(promotion.isActive());
        promotion.setImage(imageFile.getBytes());
        promotion1.setDisplayOrder(promotion.getDisplayOrder());

        promotionService.savePromotion(promotion1);

        return "redirect:/admin/promotions";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable String id, Model model) {
        log.info("Showing promotion edit: " + id);
        Optional<Promotion> promo = promotionService.getById(id);
        if (promo.isEmpty()) return "redirect:/admin/promotions";
        model.addAttribute("promotion", promo.get());
        model.addAttribute("action", "/admin/promotions/edit/" + id);
        return "promotion_form";
    }

    @PostMapping("/edit/{id}")
    public String updatePromotion(@PathVariable String id,
                                  @ModelAttribute Promotion updatedPromo,
                                  @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isEmpty()) return "redirect:/admin/promotions";
        Promotion promotion = promoOpt.get();
        promotion.setTitle(updatedPromo.getTitle());
        promotion.setStartDate(updatedPromo.getStartDate());
        promotion.setEndDate(updatedPromo.getEndDate());
        promotion.setDisplayOrder(updatedPromo.getDisplayOrder());
        promotion.setActive(updatedPromo.isActive());

        try{
            log.info(String.format("Is promotion image empty? %s", String.valueOf(imageFile.isEmpty())));
            if (!imageFile.isEmpty()) {
                byte[] image = imageFile.getBytes();
                promotion.setImage(image);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        promotionService.savePromotion(promotion);


        return "redirect:/admin/promotions";
    }

    @PostMapping("/edit/{id}/image")
    public String updateImage(@PathVariable String id, @ModelAttribute Promotion promotion) throws Exception {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isEmpty()) return "redirect:/admin/promotions";
        Promotion promo = promoOpt.get();
        promo.setImage(promotion.getImage());
        promo.setStartDate(promotion.getStartDate());
        promo.setEndDate(promotion.getEndDate());
        promo.setDisplayOrder(promotion.getDisplayOrder());
        promo.setActive(promotion.isActive());
        promo.setTitle(promotion.getTitle());
        promotionService.savePromotion(promo);
        return "redirect:/admin/promotions";
    }

    @PostMapping("/delete/{id}")
    public String deletePromotion(@PathVariable String id) {
        promotionService.deleteById(id);
        return "redirect:/admin/promotions";
    }
}

package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Promotion;
import com.smartshop.smartshop.Services.PromotionService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${app.admin.origin:http://localhost:3000}")
    private String adminOrigin;

    private String adminRedirect(String path) {
        String base = adminOrigin.endsWith("/") ? adminOrigin.substring(0, adminOrigin.length() - 1) : adminOrigin;
        return "redirect:" + base + path;
    }

    public PromotionAdminController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public String listPromotions(Model model) {
        return adminRedirect("/carousel");
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        return adminRedirect("/carousel/create");
    }

    @PostMapping("/create")
    public String createPromotion(@ModelAttribute Promotion promotion,
                                  @RequestParam("imageFile") MultipartFile imageFile) throws Exception {
        return adminRedirect("/carousel");
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable("id") String id, Model model) {
        return adminRedirect("/carousel/" + id);
    }

    @PostMapping("/edit/{id}")
    public String updatePromotion(@PathVariable("id") String id,
                                   @ModelAttribute Promotion updatedPromo,
                                   @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return adminRedirect("/carousel/" + id);
    }

    @PostMapping("/edit/{id}/image")
    public String updateImage(@PathVariable("id") String id, @ModelAttribute Promotion promotion) throws Exception {
        return adminRedirect("/carousel/" + id);
    }

    @PostMapping("/delete/{id}")
    public String deletePromotion(@PathVariable("id") String id) {
        return adminRedirect("/carousel");
    }
}

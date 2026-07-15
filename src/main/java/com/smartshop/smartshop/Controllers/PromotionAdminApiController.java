package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Promotion;
import com.smartshop.smartshop.Services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/api/1/admin/promotions")
@RequiredArgsConstructor
public class PromotionAdminApiController {

    private final PromotionService promotionService;

    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionService.findAll().stream()
                .sorted(Comparator.comparing(Promotion::getDisplayOrder, Comparator.nullsLast(Integer::compareTo)))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable String id) {
        return promotionService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPromotion(
            @RequestParam("title") String title,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam("active") boolean active,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No se subió imagen");
            }

            Promotion promotion = new Promotion();
            promotion.setTitle(title);
            promotion.setStartDate(startDate);
            promotion.setEndDate(endDate);
            promotion.setDisplayOrder(displayOrder);
            promotion.setActive(active);
            promotion.setImage(imageFile.getBytes());

            return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.savePromotion(promotion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear promoción");
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePromotion(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam("active") boolean active
    ) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Promotion promotion = promoOpt.get();
        promotion.setTitle(title);
        promotion.setStartDate(startDate);
        promotion.setEndDate(endDate);
        promotion.setDisplayOrder(displayOrder);
        promotion.setActive(active);

        return ResponseEntity.ok(promotionService.savePromotion(promotion));
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile imageFile
    ) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No se subió imagen");
            }

            Promotion promotion = promoOpt.get();
            promotion.setImage(imageFile.getBytes());

            return ResponseEntity.ok(promotionService.savePromotion(promotion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar imagen");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable String id) {
        if (!promotionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        promotionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

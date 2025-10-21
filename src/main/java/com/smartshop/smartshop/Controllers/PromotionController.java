package com.smartshop.smartshop.Controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.format.annotation.DateTimeFormat;
import com.smartshop.smartshop.Services.PromotionService;
import com.smartshop.smartshop.Models.Promotion;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/api/1/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // Obtener todas las promociones activas ordenadas por displayOrder
    @GetMapping
    public List<Promotion> getActivePromotions() {
        return promotionService.findActivePromotions();
    }

    // Obtener una promoción por ID
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable String id) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        return promoOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener la imagen de la promoción
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isPresent() && promoOpt.get().getImage() != null) {
            byte[] image = promoOpt.get().getImage();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // cambia según tipo real
            return new ResponseEntity<>(image, headers, HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();
    }

    // Crear una nueva promoción con imagen
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPromotion(
            @RequestParam String title,
            @RequestParam(defaultValue = "2025-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(defaultValue = "2025-12-31T23:59:59") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") Integer displayOrder,
            @RequestParam(defaultValue = "true") boolean active,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No se subió imagen");
            }

            Promotion promo = new Promotion();
            promo.setTitle(title);
            promo.setStartDate(startDate);
            promo.setEndDate(endDate);
            promo.setDisplayOrder(displayOrder);
            promo.setActive(active);
            promo.setImage(imageFile.getBytes());

            Promotion savedPromo = promotionService.savePromotion(promo);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPromo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir promoción");
        }
    }

    // Actualizar promoción existente (sin imagen)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam Integer displayOrder,
            @RequestParam boolean active
    ) {
        Optional<Promotion> promoOpt = promotionService.getById(id);
        if (promoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Promotion promo = promoOpt.get();
        promo.setTitle(title);
        promo.setStartDate(startDate);
        promo.setEndDate(endDate);
        promo.setDisplayOrder(displayOrder);
        promo.setActive(active);

        Promotion updatedPromo = promotionService.savePromotion(promo);
        return ResponseEntity.ok(updatedPromo);
    }

    // Actualizar solo imagen
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
            Promotion promo = promoOpt.get();
            promo.setImage(imageFile.getBytes());
            Promotion updatedPromo = promotionService.savePromotion(promo);
            return ResponseEntity.ok(updatedPromo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar imagen");
        }
    }

    // Eliminar promoción
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable String id) {
        if (!promotionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        promotionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

package com.smartshop.smartshop.Listeners;

import com.smartshop.smartshop.Events.ProductSavedEvent;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Services.MeilisearchProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductSavedListener {

    private final ProductRepository productRepository;
    private final MeilisearchProductService meilisearchProductService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProductSaved(ProductSavedEvent event) {
        if (event == null || event.productId() == null) {
            return;
        }

        Producto savedProduct = productRepository.findById(event.productId()).orElse(null);
        if (savedProduct == null) {
            log.warn("Product {} was not found after commit, skipping Meilisearch indexing", event.productId());
            return;
        }

        meilisearchProductService.indexProduct(savedProduct);
    }
}

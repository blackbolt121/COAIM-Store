package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Controllers.UrreaProductRequest;
import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.Repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UrreaProductLoadProcessor {

    private final UrreaProductRepository urreaProductRepository;
    private final VendorRepository vendorRepository;
    private final ProductoService productoService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void process(UrreaProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("El registro recibido es nulo");
        }

        if (request.codigo() == null || request.codigo().trim().isEmpty()) {
            throw new IllegalArgumentException("El producto no tiene código");
        }

        UrreaProduct saved = urreaProductRepository
                .findByCodigoOrCodigoBarras(request.codigo(), request.codigoBarras())
                .map(existing -> {
                    UrreaProduct updated = request.toEntity();
                    updated.setId(existing.getId());
                    return updated;
                })
                .orElseGet(request::toEntity);

        ensureVendor(saved.getMarca());

        UrreaProduct persisted = urreaProductRepository.save(saved);
        if (!isUnavailable(persisted.getEstatusInventario())) {
            productoService.saveUrreaProductToProduct(persisted);
        }
    }

    private void ensureVendor(String brand) {
        if (brand == null || brand.trim().isEmpty()) {
            return;
        }

        vendorRepository.findByVendorName(brand.trim()).orElseGet(() -> {
            Vendor nuevoVendor = Vendor.builder().vendorName(brand.trim()).build();
            return vendorRepository.save(nuevoVendor);
        });
    }

    private boolean isUnavailable(String status) {
        return status != null && status.trim().equalsIgnoreCase("no disponible");
    }
}

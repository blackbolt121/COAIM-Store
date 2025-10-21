package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Repositories.VendorRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ProductoService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    VendorRepository vendorRepository;
    private static final Pattern UUID_PATTERN = Pattern.compile(
            "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
    );
    private static final Pattern SKU_PATTERN = Pattern.compile("[\\s\\-/\\\\]"); // espacio, guion, /, \
    public static String classifyCode(String input) {
        if (UUID_PATTERN.matcher(input).matches()) {
            return "uuid";
        }
        // Si tiene solo letras y números (sin espacios ni caracteres especiales) -> SKU válido
        if (input.matches("[A-Za-z0-9]+")) {
            return "sku";
        }
        // Si tiene espacios, guiones, diagonales o backslash también puede ser SKU
        if (input.matches("[A-Za-z0-9\\s\\-/\\\\]+")) {
            return "sku";
        }
        return "unknown";
    }

    public List<Producto> getAllProducts(){
        return productRepository.findAll();
    }

    public Optional<Producto> getProduct(String id){
        return switch (classifyCode(id)) {
            case "uuid" -> {
                try {
                    yield productRepository.findById(UUID.fromString(id));
                } catch (IllegalArgumentException e) {
                    yield Optional.empty();
                }
            }
            case "sku" -> productRepository.findBySku(id);
            default -> Optional.empty();
        };
    }
    public Producto saveProduct(Producto producto){
        productRepository.save(producto);
        return producto;
    }

    @Transactional
    public void saveUrreaProductToProduct(UrreaProduct urreaProduct){

        Vendor vendor = vendorRepository.findByVendorName(urreaProduct.getMarca().trim()).orElse(null);
        Producto producto = productRepository.findByUrreaProduct(urreaProduct)
                .orElseGet(() -> Producto.builder()
                        .build());
        // Actualizar siempre estos campos
        producto.setCategory(urreaProduct.getClase());
        producto.setName(urreaProduct.getNombreLargo());
        producto.setDescription(urreaProduct.getDescripcionProducto());
        producto.setPrice(urreaProduct.getPrecio());
        producto.setImageUrl(urreaProduct.getFotografia());
        producto.setUrreaProduct(urreaProduct);
        producto.setSku(urreaProduct.getCodigo());
        producto.setVendor(vendor);
        // Establecer vendor si existe

        productRepository.save(producto);


    }

    public void deleteProduct(String id){
        productRepository.deleteById(UUID.fromString(id));
    }
}

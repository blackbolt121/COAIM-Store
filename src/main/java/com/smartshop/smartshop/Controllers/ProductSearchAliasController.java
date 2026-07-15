package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.SearchResponseDto;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Services.MeilisearchProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api/1/product")
public class ProductSearchAliasController {

    private final MeilisearchProductService meilisearchProductService;

    @GetMapping("/search")
    public SearchResponseDto<Producto> search(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "sort", required = false, defaultValue = "relevance") String sort,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size
    ) {
        String searchTerm = q != null ? q : query;
        return meilisearchProductService.searchProducts(searchTerm, page, size, category, brand, minPrice, maxPrice, sort);
    }
}

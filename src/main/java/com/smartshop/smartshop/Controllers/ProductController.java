package com.smartshop.smartshop.Controllers;


import com.smartshop.smartshop.Cache.ProductCacheService;
import com.smartshop.smartshop.DTO.SearchResponseDto;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Services.ProductoService;
import com.smartshop.smartshop.Services.MeilisearchProductService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@Slf4j
@CrossOrigin(origins = "*")
@RequestMapping(path = "/rest/api/1/producto")
@RestController
public class ProductController {

    @Autowired
    private ProductoService service;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductCacheService productCacheService;
    @Autowired
    private ProductoService productoService;
    @Autowired
    private MeilisearchProductService meilisearchProductService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createProduct(@RequestBody Producto producto){

        try{
            Producto p = service.saveProduct(producto);
            HashMap<String, String> response = new HashMap<String, String>(){
                {
                    put("status", String.valueOf(p));
                }
            };
            return ResponseEntity.ok().body(response);
        }catch(Exception exception){


            HashMap<String, String> response = new HashMap<String, String>(){
                {
                    put("message", "Product couldn't be created");
                }
            };
            return ResponseEntity.badRequest().body(response);
        }

    }

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
    ){
        String searchTerm = q != null ? q : query;
        return meilisearchProductService.searchProducts(searchTerm, page, size, category, brand, minPrice, maxPrice, sort);
    }

    @GetMapping("/all")
    public Page<Producto> getAllProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categories", required = false) Optional<List<String>> categories,  // Aceptando múltiples categorías
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "brand", required = false) String brand,
            @PageableDefault(page = 0, size = 12) Pageable pageable) {
        if(name == null && (categories.isEmpty()) && minPrice == null && maxPrice == null && brand == null) {
            return productRepository.findAll(pageable);
        }
        System.out.println(brand);
        System.out.println(categories.orElse(List.of()));
        return productRepository.findByFilters(name, categories.orElse(null), minPrice, maxPrice, brand, pageable);

    }

    @GetMapping(path = "count")
    public ResponseEntity<String> countProducts(){
        JSONObject response = new JSONObject();
        long count = productRepository.count();
        response.put("count", count);
        return ResponseEntity.ok().header("Content-Type", "application/json").body(response.toString());
    }

    @GetMapping(path = "top")
    public ResponseEntity<List<Producto>> getTopProducts(){
        return ResponseEntity.ok(productRepository.findRandomProducts());
    }
    @GetMapping(path = "")
    public ResponseEntity<Producto> getProduct(@RequestParam("id") String id){
        System.out.println(id);
        Producto product = service.getProduct(id).orElse(null);
        if(product != null){
            return ResponseEntity.ok().body(product);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping(path = "")
    public ResponseEntity<String> updateProduct(@RequestParam("id") String id, @RequestBody Producto updatedProduct){


        Producto search = service.getProduct(id).orElse(null);

        if(search == null){
            return ResponseEntity.notFound().build();
        }

        if(!updatedProduct.getId().equals(search.getId())){
            return ResponseEntity.badRequest().build();
        }

        service.saveProduct(updatedProduct);

        return ResponseEntity.status(204).build();
    }


    

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> obtenerCategorias() {


        List<String> topProducts = productRepository.findDistinctCategories();

//        List<String> topProducts = productCacheService.getAllCategories();
//        if (topProducts == null) {
//            log.info("topProducts is null");
//            List<String> categories = productRepository.findDistinctCategories();
//            productCacheService.setAllCategories(categories);
//            topProducts = categories;
//        }else{
//            log.info("topProducts is not null");
//        }

        return ResponseEntity.ok(topProducts);
    }
}

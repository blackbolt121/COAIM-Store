package com.smartshop.smartshop.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartshop.smartshop.DTO.SearchResponseDto;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MeilisearchProductService {
    private static final List<String> SEARCHABLE_ATTRIBUTES = List.of(
            "name",
            "sku",
            "description",
            "category",
            "vendorName",
            "safeSku",
            "keywords",
            "bullets",
            "caracteristica"
    );
    private static final List<String> FILTERABLE_ATTRIBUTES = List.of("category", "vendorId", "vendorName", "price");
    private static final List<String> SORTABLE_ATTRIBUTES = List.of("price");

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${smartshop.meilisearch.host:http://localhost:7700}")
    private String host;

    @Value("${smartshop.meilisearch.api-key:}")
    private String apiKey;

    @Value("${smartshop.meilisearch.index-products:products}")
    private String indexName;

    @Value("${smartshop.meilisearch.enabled:true}")
    private boolean enabled;

    public MeilisearchProductService(ProductRepository productRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @PostConstruct
    public void initializeIndex() {
        if (!enabled) {
            log.info("Meilisearch integration disabled");
            return;
        }

        try {
            ensureIndexExists();
            ensureIndexSettings();
            reindexAllProducts();
        } catch (Exception exception) {
            log.warn("Meilisearch initialization skipped: {}", exception.getMessage());
        }
    }

    public SearchResponseDto<Producto> searchProducts(
            String query,
            int page,
            int size,
            String category,
            String brand,
            Double minPrice,
            Double maxPrice,
            String sort
    ) {
        if (!enabled || query == null || query.trim().isBlank()) {
            return emptyResponse(page, size);
        }

        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("q", query == null ? "" : query.trim());
            payload.put("offset", Math.max(page, 0) * Math.max(size, 1));
            payload.put("limit", Math.max(size, 1));

            String filter = buildFilter(category, brand, minPrice, maxPrice);
            if (!filter.isBlank()) {
                payload.put("filter", filter);
            }

            if (sort != null && !sort.isBlank() && !"relevance".equalsIgnoreCase(sort)) {
                String sortExpression = toSortExpression(sort);
                if (!sortExpression.isBlank()) {
                    payload.put("sort", List.of(sortExpression));
                }
            }

            payload.put("facets", List.of("category", "vendorName"));

            JsonNode response = executeJson("POST", "/indexes/" + indexName + "/search", payload);
            return mapSearchResponse(response, page, size);
        } catch (Exception exception) {
            log.warn("Meilisearch search failed, returning empty page: {}", exception.getMessage());
            return emptyResponse(page, size);
        }
    }

    public void indexProduct(Producto producto) {
        if (!enabled || producto == null || producto.getId() == null) {
            return;
        }

        try {
            executeJson("POST", "/indexes/" + indexName + "/documents", List.of(toDocument(producto, null)));
        } catch (Exception exception) {
            log.warn("Failed to index product {}: {}", producto.getId(), exception.getMessage());
        }
    }

    public void indexProduct(Producto producto, UrreaProduct urreaProduct) {
        if (!enabled || producto == null || producto.getId() == null) {
            return;
        }

        try {
            executeJson("POST", "/indexes/" + indexName + "/documents", List.of(toDocument(producto, urreaProduct)));
        } catch (Exception exception) {
            log.warn("Failed to index product {}: {}", producto.getId(), exception.getMessage());
        }
    }

    public void indexProducts(Collection<Producto> products) {
        if (!enabled || products == null || products.isEmpty()) {
            return;
        }

        try {
            List<IndexedProduct> documents = products.stream()
                    .filter(Objects::nonNull)
                    .map(product -> toDocument(product, product.getUrreaProduct()))
                    .toList();
            executeJson("POST", "/indexes/" + indexName + "/documents", documents);
        } catch (Exception exception) {
            log.warn("Failed to bulk index products: {}", exception.getMessage());
        }
    }

    public void deleteProduct(String productId) {
        if (!enabled || productId == null || productId.isBlank()) {
            return;
        }

        try {
            execute("DELETE", "/indexes/" + indexName + "/documents/" + productId, null);
        } catch (Exception exception) {
            log.warn("Failed to delete product {} from Meilisearch: {}", productId, exception.getMessage());
        }
    }

    public void reindexAllProducts() {
        if (!enabled) {
            return;
        }

        indexProducts(productRepository.findAllForIndexing());
    }

    private SearchResponseDto<Producto> emptyResponse(int page, int size) {
        return SearchResponseDto.<Producto>builder()
                .content(List.of())
                .totalElements(0)
                .totalPages(0)
                .number(page)
                .size(size)
                .numberOfElements(0)
                .first(page <= 0)
                .last(true)
                .empty(true)
                .facets(Map.of())
                .build();
    }

    private SearchResponseDto<Producto> mapSearchResponse(JsonNode response, int page, int size) throws JsonProcessingException {
        List<IndexedProduct> documents = new ArrayList<>();
        JsonNode hitsNode = response.path("hits");
        if (hitsNode.isArray()) {
            for (JsonNode hit : hitsNode) {
                documents.add(objectMapper.treeToValue(hit, IndexedProduct.class));
            }
        }

        long totalElements = response.path("estimatedTotalHits").asLong(documents.size());
        int totalPages = size <= 0 ? 0 : (int) Math.ceil((double) totalElements / size);

        Map<String, Map<String, Long>> facets = new LinkedHashMap<>();
        JsonNode facetDistribution = response.path("facetDistribution");
        if (facetDistribution.isObject()) {
            Map<String, Map<String, Integer>> rawFacets = objectMapper.convertValue(
                    facetDistribution,
                    new TypeReference<>() {
                    }
            );
            if (rawFacets.containsKey("category")) {
                facets.put("category", rawFacets.get("category").entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().longValue(), (left, right) -> left, LinkedHashMap::new)));
            }
            if (rawFacets.containsKey("vendorName")) {
                facets.put("brand", rawFacets.get("vendorName").entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().longValue(), (left, right) -> left, LinkedHashMap::new)));
            }
        }

        List<Producto> content = documents.stream().map(this::toProducto).toList();

        return SearchResponseDto.<Producto>builder()
                .content(content)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .number(page)
                .size(size)
                .numberOfElements(content.size())
                .first(page <= 0)
                .last(totalPages == 0 || page >= totalPages - 1)
                .empty(content.isEmpty())
                .facets(facets)
                .build();
    }

    private Producto toProducto(IndexedProduct document) {
        Vendor vendor = null;
        if (document.vendorId != null || document.vendorName != null) {
            vendor = Vendor.builder()
                    .vendorId(document.vendorId)
                    .vendorName(document.vendorName)
                    .build();
        }

        return Producto.builder()
                .id(document.id == null ? null : UUID.fromString(document.id))
                .name(document.name)
                .sku(document.sku)
                .description(document.description)
                .price(document.price == null ? 0.0 : document.price)
                .imageUrl(document.imageUrl)
                .category(document.category)
                .vendor(vendor)
                .build();
    }

    private IndexedProduct toDocument(Producto producto, UrreaProduct urreaProduct) {
        Vendor vendor = producto.getVendor();
        return IndexedProduct.builder()
                .id(producto.getId() == null ? null : producto.getId().toString())
                .name(producto.getName())
                .sku(producto.getSku())
                .description(producto.getDescription())
                .price(producto.getPrice())
                .imageUrl(producto.getImageUrl())
                .category(producto.getCategory())
                .vendorId(vendor == null ? null : vendor.getVendorId())
                .vendorName(vendor == null ? null : vendor.getVendorName())
                .safeSku(urreaProduct == null ? null : urreaProduct.getSafe_sku())
                .keywords(urreaProduct == null ? null : urreaProduct.getKeywords())
                .bullets(urreaProduct == null ? null : urreaProduct.getBullets())
                .caracteristica(urreaProduct == null ? null : urreaProduct.getCaracteristica())
                .build();
    }

    private String buildFilter(String category, String brand, Double minPrice, Double maxPrice) {
        List<String> filters = new ArrayList<>();
        if (category != null && !category.isBlank()) {
            filters.add("category = \"" + escapeFilterValue(category) + "\"");
        }
        if (brand != null && !brand.isBlank()) {
            filters.add("vendorId = \"" + escapeFilterValue(brand) + "\"");
        }
        if (minPrice != null) {
            filters.add("price >= " + minPrice);
        }
        if (maxPrice != null) {
            filters.add("price <= " + maxPrice);
        }
        return String.join(" AND ", filters);
    }

    private String escapeFilterValue(String value) {
        return value.replace("\"", "\\\"");
    }

    private String toSortExpression(String sort) {
        return switch (sort) {
            case "price_asc" -> "price:asc";
            case "price_desc" -> "price:desc";
            default -> "";
        };
    }

    private void ensureIndexExists() throws IOException, InterruptedException {
            HttpResponse<String> response = execute("GET", "/indexes/" + indexName);
        if (response.statusCode() == 404) {
            Map<String, Object> payload = Map.of(
                    "uid", indexName,
                    "primaryKey", "id"
            );
            executeJson("POST", "/indexes", payload);
        }
    }

    private void ensureIndexSettings() throws IOException, InterruptedException {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("searchableAttributes", SEARCHABLE_ATTRIBUTES);
        payload.put("filterableAttributes", FILTERABLE_ATTRIBUTES);
        payload.put("sortableAttributes", SORTABLE_ATTRIBUTES);
            executeJson("PATCH", "/indexes/" + indexName + "/settings", payload);
        }

    private JsonNode executeJson(String method, String path, Object body) throws IOException, InterruptedException {
        HttpResponse<String> response = execute(method, path, body);
        if (response.body() == null || response.body().isBlank()) {
            return objectMapper.createObjectNode();
        }
        return objectMapper.readTree(response.body());
    }

    private HttpResponse<String> execute(String method, String path) throws IOException, InterruptedException {
        return execute(method, path, (Object) null);
    }

    private HttpResponse<String> execute(String method, String path, Object body) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(host + path))
                .timeout(Duration.ofSeconds(10))
                .header("Accept", "application/json");

        if (apiKey != null && !apiKey.isBlank()) {
            builder.header("Authorization", "Bearer " + apiKey);
        }

        if (body != null) {
            builder.header("Content-Type", "application/json");
            String jsonBody = objectMapper.writeValueAsString(body);
            builder.method(method, HttpRequest.BodyPublishers.ofString(jsonBody));
        } else {
            builder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        return httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class IndexedProduct {
        private String id;
        private String name;
        private String sku;
        private String description;
        private Double price;
        private String imageUrl;
        private String category;
        private String vendorId;
        private String vendorName;
        private String safeSku;
        private String keywords;
        private String bullets;
        private String caracteristica;
    }
}

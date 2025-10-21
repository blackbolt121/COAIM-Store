package com.smartshop.smartshop.Cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.smartshop.smartshop.Models.Producto;

import java.time.Duration;
import java.util.List;

@Service
public class ProductCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public ProductCacheService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveProduct(String id, Producto product) {
        redisTemplate.opsForValue().set("product:" + id, product, Duration.ofMinutes(10));
    }

    public Producto getProduct(String id) {
        Object value = redisTemplate.opsForValue().get("product:" + id);
        return value != null ? (Producto) value : null;
    }

    public List<String> getAllCategories(){
        Object value = redisTemplate.opsForValue().get("categories");
        return value != null ? (List<String>) value : null;
    }

    public void setAllCategories(List<String> categories){
        redisTemplate.opsForValue().set("categories", categories);
    }

    public List<Producto> getTopProducts() {
        Object value = redisTemplate.opsForValue().get("topProducts");
        return value != null ? (List<Producto>) value : null;
    }

    public void setTopProducts(List<Producto> topProducts) {
        redisTemplate.opsForValue().set("topProducts", topProducts);
    }
}
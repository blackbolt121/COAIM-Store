package com.smartshop.smartshop.DTO;


import lombok.*;

@Setter
@Getter
public class CategoryProductCountDto {
    private String category;
    private Long count;

    public CategoryProductCountDto(String category, Long productCount) {
        this.category = category;
        this.count = productCount;
    }
}
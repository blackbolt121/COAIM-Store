package com.smartshop.smartshop.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDto<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int number;
    private int size;
    private int numberOfElements;
    private boolean first;
    private boolean last;
    private boolean empty;
    private Map<String, Map<String, Long>> facets;
}

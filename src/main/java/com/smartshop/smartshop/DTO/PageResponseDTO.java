package com.smartshop.smartshop.DTO;

import java.util.List;

public record PageResponseDTO<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int number,
        int size,
        boolean first,
        boolean last,
        boolean empty
) {
}

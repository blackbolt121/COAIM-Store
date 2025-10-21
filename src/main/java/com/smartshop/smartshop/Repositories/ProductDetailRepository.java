package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.ProductDetailId;
import com.smartshop.smartshop.Models.PedidoDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailRepository extends JpaRepository<PedidoDetail, ProductDetailId> {
    // Spring Data JPA entenderá cómo trabajar con el ID compuesto automáticamente.
    // Puedes añadir métodos de consulta personalizados aquí si los necesitas.
}
package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.DTO.MonthlySalesDto;
import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.Usuario;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartshop.smartshop.DTO.MonthlySalesDto;

import java.time.LocalDateTime;
import java.util.List;


public interface PedidoRepository extends JpaRepository<Pedidos, Long> {

    @NonNull
    Page<Pedidos> findAllByUsuario(@NonNull Usuario usuario,@NonNull Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.total), 0.0) FROM Pedidos p WHERE p.createdAt >= :startDate AND p.createdAt < :endDate")
    Double sumTotalByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    @Query("SELECT FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt), SUM(p.total) " +
            "FROM Pedidos p WHERE p.createdAt >= :startDate " +
            "GROUP BY FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt) " +
            "ORDER BY FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt)")
    List<Object[]> findMonthlySalesRawData(@Param("startDate") LocalDateTime startDate);

    List<Pedidos> findTop5ByOrderByCreatedAtDesc();

    long countByPedidoStatusIn(List<PedidoStatus> statuses);

}

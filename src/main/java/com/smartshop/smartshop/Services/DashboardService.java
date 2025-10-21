package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.DTO.CategoryProductCountDto;
import com.smartshop.smartshop.DTO.MonthlySalesDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductRepository productoRepository;

    // Para la tarjeta de "Pedidos Nuevos"
    public long getNuevosPedidosCount() {
        // Usamos el estado EN_PROCESO de tu enum para contar los pedidos activos
        List<PedidoStatus> statuses = List.of(PedidoStatus.EN_PROCESO);
        return pedidoRepository.countByPedidoStatusIn(statuses);
    }

    // Para la tarjeta de "Ingresos del Mes"
    public Double getIngresosMesActual() {
        LocalDateTime inicioMes = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime finMes = YearMonth.now().plusMonths(1).atDay(1).atStartOfDay();
        return pedidoRepository.sumTotalByCreatedAtBetween(inicioMes, finMes);
    }

    // Para el gráfico de barras
    public List<MonthlySalesDto> getSalesDataForChart() {
        LocalDateTime seisMesesAtras = LocalDateTime.now().minusMonths(6);
        List<Object[]> rawData = pedidoRepository.findMonthlySalesRawData(seisMesesAtras);

        // Mapea la lista de Object[] a una lista de MonthlySalesDto
        return rawData.stream()
                .map(record -> {
                    Integer year = (Integer) record[0];
                    Integer month = (Integer) record[1];
                    // El resultado de SUM puede ser Double o BigDecimal, se maneja de forma segura
                    Double totalSales = 0.0;
                    if (record[2] instanceof BigDecimal) {
                        totalSales = ((BigDecimal) record[2]).doubleValue();
                    } else if (record[2] instanceof Double) {
                        totalSales = (Double) record[2];
                    }
                    return new MonthlySalesDto(year, month, totalSales);
                })
                .collect(Collectors.toList());
    }

    // Para el gráfico de dona
    public List<CategoryProductCountDto> getCategoryDataForChart() {
        return productoRepository.countProductsByVendor();
    }

    public List<Pedidos> getUltimosPedidos() {
        return pedidoRepository.findTop5ByOrderByCreatedAtDesc();
    }
}
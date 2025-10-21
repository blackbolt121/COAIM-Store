package com.smartshop.smartshop.DTO;



// DTO para los datos del gráfico de barras (Ingresos por Mes)

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
public class MonthlySalesDto {

    private Integer year;
    private Integer month;
    private Double totalSales;

    public MonthlySalesDto(Integer year, Integer month, Double totalSales) {
        this.year = year;
        this.month = month;
        this.totalSales = totalSales;
    }

    public MonthlySalesDto(Integer year, Integer month, BigDecimal totalSales) {
        this.year = year;
        this.month = month;
        this.totalSales = (totalSales == null) ? 0.0 : totalSales.doubleValue();
    }


}
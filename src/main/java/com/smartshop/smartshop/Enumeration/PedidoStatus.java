package com.smartshop.smartshop.Enumeration;


import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString(of = "{status}")
public enum PedidoStatus {
    EN_PROCESO("En processo", 1),
    ENVIADO("Enviado", 2),
    ENTREGADO("Entregado", 3),
    CANCELADO("Cancelado", 4);

    private final String status;
    private final int id;

}

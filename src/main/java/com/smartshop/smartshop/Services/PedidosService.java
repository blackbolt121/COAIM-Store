package com.smartshop.smartshop.Services;


import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Repositories.ProductDetailRepository;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class PedidosService {

    private final PedidoRepository pedidoRepository;
    private final CartService cartService;
    private final UrreaProductRepository urreaProductRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductoService productoService;


    @Transactional
    public Pedidos generatePedido(Cart cart) {
        // Usamos System.out.println porque es directo y no depende de ninguna configuración de logs
        System.out.println("\n--- [INICIO] Ejecutando generatePedido ---");

        // 1. Crea el objeto Pedido principal.
        Pedidos nuevoPedido = new Pedidos();
        nuevoPedido.setUsuario(cart.getUsuario());
        nuevoPedido.setPedidoStatus(PedidoStatus.EN_PROCESO);
        nuevoPedido.setGuia("");
        pedidoRepository.saveAndFlush(nuevoPedido);
        //pedidoRepository.save(nuevoPedido);

        // 2. Agrupa los productos.
        Map<UUID, Integer> productQuantityMap = new HashMap<>();
        for (CartItem item : cart.getItems()) {
            productQuantityMap.merge(item.getProduct().getId(), item.getQuantity(), Integer::sum);
        }
        System.out.println("[PASO 2] Mapa de productos creado. Contiene " + productQuantityMap.size() + " productos únicos.");

        // 3. Itera sobre los productos.
        Set<PedidoDetail> pedidoDetails = new HashSet<>();
        for (Map.Entry<UUID, Integer> entry : productQuantityMap.entrySet()) {
            System.out.println(nuevoPedido.getId());
            Producto producto = productoService.getProduct(entry.getKey().toString()).orElseThrow();
            PedidoDetail detail = PedidoDetail.builder()
                    .id(new ProductDetailId(nuevoPedido.getId(), producto.getId()))
                    .producto(producto)
                    .pedidos(nuevoPedido)
                    .static_price(producto.getPrice())
                    .quantity(entry.getValue())
                    .build();
            System.out.println(detail);
            nuevoPedido.addDetail(detail);
        }

        if (!nuevoPedido.getPedidoDetails().isEmpty()) {
            PedidoDetail primerDetalle = nuevoPedido.getPedidoDetails().iterator().next();
            System.out.println("El campo 'pedidos' del PRIMER objeto en la colección es null? " + (primerDetalle.getPedidos() == null));
        }



        // 4. Calcula el total.
        nuevoPedido.calcularTotal();

        // 5. Guarda el pedido.
        try {
            //nuevoPedido.setPedidoDetails(pedidoDetails);
            return pedidoRepository.save(nuevoPedido);
        } catch (Exception e) {
            System.err.println("\n[ERROR] EXCEPCIÓN ATRAPADA DURANTE EL SAVE!");
            throw e;
        }
    }
}
